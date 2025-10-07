<template>
  <div class="account-form">
    <!-- Заголовок и кнопка добавления -->
    <div class="account-form__header">
      <h1 class="account-form__title">Управление учетными записями</h1>
      <button 
        @click="addNewAccount" 
        class="account-form__add-button btn btn-primary"
      >
        + Добавить учетную запись
      </button>
    </div>

    <!-- Подсказка для поля метка -->
    <div class="account-form__hint alert alert-info">
      <small>В поле "Метка" вводите текстовые метки через знак <strong>;</strong> (максимум 50 символов)</small>
    </div>

    <!-- Таблица учетных записей -->
    <div class="account-form__table-container">
      <table class="account-form__table table table-striped table-hover">
        <thead class="account-form__table-header">
          <tr>
            <th class="account-form__table-col--label">Метка</th>
            <th class="account-form__table-col--type">Тип записи</th>
            <th class="account-form__table-col--login">Логин</th>
            <th class="account-form__table-col--password">Пароль</th>
            <th class="account-form__table-col--actions">Действия</th>
          </tr>
        </thead>
        <tbody class="account-form__table-body">
          <AccountTableRow
            v-for="account in displayedAccounts"
            :key="account.id"
            :account="account"
            :is-new="isNewAccount(account.id)"
            @update="updateAccount"
            @delete="deleteAccount(account.id)"
            @validityChange="handleValidityChange(account.id, $event)"
          />
        </tbody>
      </table>
    </div>

    <div 
      v-if="displayedAccounts.length === 0" 
      class="account-form__empty-state alert alert-warning"
    >
      Нет учетных записей. Нажмите "+" чтобы добавить первую.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAccountStore } from '../stores/account'
import AccountTableRow from './AccountTableRow.vue'
import type { Account } from '../types/account'

const accountStore = useAccountStore()

const newAccounts = ref<Account[]>([])
const accountValidity = reactive<{ [key: string]: boolean }>({})

const displayedAccounts = computed(() => [
  ...accountStore.accounts,
  ...newAccounts.value
])

const isNewAccount = (id: string) => {
  return newAccounts.value.some(acc => acc.id === id)
}

const addNewAccount = () => {
  const newAccount: Account = {
    id: Date.now().toString(),
    labels: [],
    type: 'Локальная',
    login: '',
    password: ''
  }
  newAccounts.value.push(newAccount)
}

const updateAccount = (account: Account) => {
  if (isNewAccount(account.id)) {
    const success = accountStore.addAccount(account)
    if (success) {
      newAccounts.value = newAccounts.value.filter(acc => acc.id !== account.id)
    }
  } else {
    accountStore.updateAccount(account.id, account)
  }
}

const deleteAccount = (id: string) => {
  if (isNewAccount(id)) {
    newAccounts.value = newAccounts.value.filter(acc => acc.id !== id)
    delete accountValidity[id]
  } else {
    accountStore.deleteAccount(id)
  }
}

const handleValidityChange = (id: string, isValid: boolean) => {
  accountValidity[id] = isValid
}
</script>

<style scoped>
.account-form {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.account-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dee2e6;
}

.account-form__title {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.account-form__add-button {
  font-weight: 500;
}

.account-form__hint {
  margin-bottom: 24px;
  border: none;
  background-color: #e7f3ff;
}

.account-form__table-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.account-form__table {
  margin: 0;
}

.account-form__table-header {
  background-color: #f8f9fa;
}

.account-form__table-col--label {
  width: 25%;
  min-width: 200px;
}

.account-form__table-col--type {
  width: 15%;
  min-width: 150px;
}

.account-form__table-col--login {
  width: 25%;
  min-width: 200px;
}

.account-form__table-col--password {
  width: 20%;
  min-width: 150px;
}

.account-form__table-col--actions {
  width: 15%;
  min-width: 100px;
  text-align: center;
}

.account-form__empty-state {
  text-align: center;
  margin: 40px 0;
}

.account-form__stats {
  text-align: center;
  margin-top: 16px;
}
</style>