export interface AccountLabel {
  text: string;
}

export interface Account {
  id: string;
  label: string; // строка меток через ;
  labels: AccountLabel[]; // преобразованный массив меток
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
}

export interface AccountForm {
  label: string;
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string;
}