const fs = require('fs');
const path = require('path');

function findWorkflowFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findWorkflowFiles(full));
    else if (entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

const files = findWorkflowFiles('src/data/workflows');
const workflows = files.map((f) => ({ file: f, data: JSON.parse(fs.readFileSync(f, 'utf8')) }));
const allIds = new Set(workflows.map((w) => w.data.id));

let errorCount = 0;
function fail(file, message) {
  console.log(`✗ ${file}\n  ${message}`);
  errorCount++;
}

const seenWorkflowIds = new Set();

for (const { file, data } of workflows) {
  if (seenWorkflowIds.has(data.id)) {
    fail(file, `id de workflow dupliqué : "${data.id}"`);
  }
  seenWorkflowIds.add(data.id);

  const orders = data.steps.map((s) => s.order);
  const sortedOrders = [...orders].sort((a, b) => a - b);
  const sequential = sortedOrders.every((o, i) => o === i + 1);
  if (!sequential) {
    fail(file, `ordre des étapes non séquentiel : [${orders.join(', ')}]`);
  }

  const stepIds = data.steps.map((s) => s.id);
  if (new Set(stepIds).size !== stepIds.length) {
    fail(file, 'des id d\'étape sont dupliqués au sein du workflow');
  }

  for (const step of data.steps) {
    const checklist = (step.validation && step.validation.checklist) || [];
    const checklistIds = checklist.map((c) => c.id);
    if (new Set(checklistIds).size !== checklistIds.length) {
      fail(file, `étape "${step.id}" : des id de checklist sont dupliqués`);
    }
  }

  const suggestions = (data.completion && data.completion.nextWorkflowSuggestions) || [];
  for (const suggestedId of suggestions) {
    if (!allIds.has(suggestedId)) {
      fail(file, `nextWorkflowSuggestions référence un id inexistant : "${suggestedId}"`);
    }
  }
}

console.log(`\n${workflows.length} workflow(s) analyse(s).`);
if (errorCount === 0) {
  console.log('OK: tous les workflows sont structurellement valides.');
  process.exit(0);
} else {
  console.log(`${errorCount} probleme(s) detecte(s).`);
  process.exit(1);
}
