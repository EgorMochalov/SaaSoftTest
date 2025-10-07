import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, AccountLabel } from '../types/account'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const loadFromStorage = () => {
    const stored = localStorage.getItem('accounts')
    if (stored) {
      accounts.value = JSON.parse(stored)
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  const parseLabels = (labelString: string): AccountLabel[] => {
    if (!labelString.trim()) return []
    return labelString.split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => ({ text: item }))
  }

  const addAccount = (account: Account) => {    
    const newAccount: Account = {
      ...account
    }
    accounts.value.push(newAccount)
    saveToStorage()
    return newAccount.id
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      const updatedAccount = { ...accounts.value[index], ...updates }
            
      accounts.value[index] = updatedAccount
      saveToStorage()
      return true
    }
    return false
  }

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id)
    saveToStorage()
  }

  loadFromStorage()

  return {
    accounts: computed(() => accounts.value),
    addAccount,
    updateAccount,
    deleteAccount,
    parseLabels
  }
})