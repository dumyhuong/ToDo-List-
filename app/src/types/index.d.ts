export interface IToDo {
    _id: string;
    text: string;
    complete: boolean;
    createdAt?: Date;
    deadline?: Date;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}