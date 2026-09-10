import { el } from '@/utils/dom';

interface TextFieldOptions {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly multiline?: boolean;
  readonly placeholder?: string;
}

export function createTextField(
  options: TextFieldOptions,
): { field: HTMLElement; input: HTMLInputElement | HTMLTextAreaElement } {
  const attrs = {
    id: options.id,
    name: options.id,
    ...(options.required ? { required: 'true' } : {}),
    ...(options.placeholder ? { placeholder: options.placeholder } : {}),
  };

  const input = options.multiline
    ? el('textarea', { ...attrs, rows: '3' })
    : el('input', { ...attrs, type: 'text' });
  input.value = options.value;

  const field = el('div', { class: 'field' }, [
    el('label', { for: options.id }, [options.label + (options.required ? ' *' : '')]),
    input,
  ]);

  return { field, input };
}

interface SelectFieldOptions {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly string[];
  readonly required?: boolean;
}

export function createSelectField(
  options: SelectFieldOptions,
): { field: HTMLElement; select: HTMLSelectElement } {
  const select = el('select', {
    id: options.id,
    name: options.id,
    ...(options.required ? { required: 'true' } : {}),
  });

  options.options.forEach((optionValue) => {
    const optionEl = el('option', { value: optionValue }, [optionValue]);
    if (optionValue === options.value) optionEl.setAttribute('selected', 'true');
    select.appendChild(optionEl);
  });

  const field = el('div', { class: 'field' }, [
    el('label', { for: options.id }, [options.label + (options.required ? ' *' : '')]),
    select,
  ]);

  return { field, select };
}
