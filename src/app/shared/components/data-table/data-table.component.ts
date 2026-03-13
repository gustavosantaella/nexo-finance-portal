import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl transition-all duration-300">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-700/50 text-slate-400 text-sm uppercase tracking-wider">
          <tr>
            <th *ngFor="let col of columns" class="px-6 py-4 font-semibold border-b border-slate-700">
              {{ col.label }}
            </th>
            <th *ngIf="hasActions" class="px-6 py-4 font-semibold border-b border-slate-700 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
          <tr *ngFor="let item of tableData" class="hover:bg-indigo-500/5 transition-colors group">
            <td *ngFor="let col of columns" class="px-6 py-4">
              <ng-container *ngIf="!columnTemplates[col.key]; else customCell">
                {{ item[col.key] }}
              </ng-container>
              <ng-template #customCell>
                <ng-container *ngTemplateOutlet="columnTemplates[col.key]; context: { $implicit: item }"></ng-container>
              </ng-template>
            </td>
            <td *ngIf="hasActions" class="px-6 py-4 text-right">
              <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: item }"></ng-container>
            </td>
          </tr>
          <tr *ngIf="tableData.length === 0">
            <td [attr.colspan]="columns.length + (hasActions ? 1 : 0)" class="px-6 py-8 text-center text-slate-500 italic">
              No se encontraron resultados
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  private _tableData: any[] = [];
  @Input() set tableData(value: any[]) {
    console.log('DataTable: actualizando tableData con:', value?.length, 'items');
    this._tableData = value || [];
  }
  get tableData(): any[] {
    return this._tableData;
  }
  @Input() hasActions = false;

  @Input() columnTemplates: { [key: string]: TemplateRef<any> } = {};
  @Input() actionsTemplate!: TemplateRef<any>;
}
