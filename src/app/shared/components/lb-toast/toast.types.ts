export interface LbToast{
    type: LbToastType;
    message: string;
}

export type LbToastType = 'success' | 'error' | 'basic' | 'info';