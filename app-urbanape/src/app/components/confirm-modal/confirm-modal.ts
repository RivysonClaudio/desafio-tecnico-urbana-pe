import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Tem certeza que deseja realizar esta ação?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() confirmButtonClass = 'bg-cyan-500 hover:bg-cyan-600';
  @Input() danger = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
