import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, AccountLabel } from '../types/account'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  // Загрузка из localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem('accounts')
    if (stored) {
      accounts.value = JSON.parse(stored)
    }
  }

  // Сохранение в localStorage
  const saveToStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  // Преобразование строки меток в массив объектов
  const parseLabels = (labelString: string): AccountLabel[] => {
    if (!labelString.trim()) return []
    return labelString.split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => ({ text: item }))
  }

  // Добавление новой учетной записи
  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      label: '',
      labels: [],
      type: 'Локальная',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
    saveToStorage()
    return newAccount.id
  }

  // Обновление учетной записи
  const updateAccount = (id: string, updates: Partial<Account>) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      // Если обновляется поле label, пересчитываем labels
      if (updates.label !== undefined) {
        updates.labels = parseLabels(updates.label)
      }
      
      accounts.value[index] = { ...accounts.value[index], ...updates }
      saveToStorage()
    }
  }

  // Удаление учетной записи
  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id)
    saveToStorage()
  }

  // Загружаем данные при инициализации
  loadFromStorage()

  return {
    accounts: computed(() => accounts.value),
    addAccount,
    updateAccount,
    deleteAccount
  }
})