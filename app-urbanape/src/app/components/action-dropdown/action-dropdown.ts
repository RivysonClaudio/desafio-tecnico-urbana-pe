import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionItem {
  label: string;
  icon: 'edit' | 'delete' | 'toggle' | 'custom';
  action: string;
  danger?: boolean;
  customIcon?: string;
}

@Component({
  selector: 'app-action-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-dropdown.html',
  styleUrl: './action-dropdown.css',
})
export class ActionDropdownComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() actions: ActionItem[] = [];
  @Input() toggleStatus?: boolean;

  @Output() actionClick = new EventEmitter<string>();
  @Output() toggleOpen = new EventEmitter<void>();

  @ViewChild('triggerButton', { static: false }) triggerButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef<HTMLDivElement>;

  dropdownPosition = { top: 0, right: 0 };

  private clickListener?: () => void;

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.updatePosition();
    }
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onScrollOrResize(): void {
    if (this.isOpen) {
      this.updatePosition();
    }
  }

  updatePosition(): void {
    if (!this.triggerButton?.nativeElement) return;

    setTimeout(() => {
      const button = this.triggerButton.nativeElement;
      const rect = button.getBoundingClientRect();
      
      this.dropdownPosition = {
        top: rect.bottom + 8, // 8px = mt-2 (0.5rem)
        right: window.innerWidth - rect.right
      };
    }, 0);
  }

  onActionClick(action: string): void {
    if (action === 'toggle') {
      this.actionClick.emit('toggle');
    } else {
      this.actionClick.emit(action);
    }
    this.isOpen = false;
  }

  onToggleClick(): void {
    this.toggleOpen.emit();
    if (!this.isOpen) {
      setTimeout(() => {
        this.updatePosition();
        this.setupClickListener();
      }, 0);
    } else {
      this.removeClickListener();
    }
  }

  private setupClickListener(): void {
    this.removeClickListener();
    this.clickListener = () => {
      if (this.isOpen) {
        this.toggleOpen.emit();
      }
    };
    setTimeout(() => {
      document.addEventListener('click', this.clickListener!);
    }, 0);
  }

  private removeClickListener(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = undefined;
    }
  }

  getIconPath(action: ActionItem): string {
    if (action.customIcon) {
      return action.customIcon;
    }

    switch (action.icon) {
      case 'edit':
        return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
      case 'delete':
        return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16';
      case 'toggle':
        if (this.toggleStatus) {
          return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636';
        } else {
          return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        }
      default:
        return '';
    }
  }
}
