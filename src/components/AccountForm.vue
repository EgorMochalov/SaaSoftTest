<template>
  <div class="account-form">
    <!-- Заголовок и кнопка добавления -->
    <div class="header">
      <h1>Управление учетными записями</h1>
      <button @click="addNewAccount" class="add-button">
        + Добавить учетную запись
      </button>
    </div>

    <!-- Подсказка для поля метка -->
    <div class="hint">
      <small>В поле "Метка" вводите текстовые метки через знак ; (максимум 50 символов)</small>
    </div>

    <!-- Список учетных записей -->
    <div class="accounts-list">
      <AccountItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @update="updateAccount"
        @delete="deleteAccount(account.id)"
      />
    </div>

    <!-- Сообщение если нет учетных записей -->
    <div v-if="accounts.length === 0" class="empty-state">
      Нет учетных записей. Нажмите "+" чтобы добавить первую.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '../stores/account'
import AccountItem from './AccountItem.vue'
import type { Account } from '../types/account'

const accountStore = useAccountStore()
const accounts = computed(() => accountStore.accounts)

// Добавление новой учетной записи
const addNewAccount = () => {
  accountStore.addAccount()
}

// Обновление учетной записи
const updateAccount = (account: Account) => {
  accountStore.updateAccount(account.id, account)
}

// Удаление учетной записи
const deleteAccount = (id: string) => {
  accountStore.deleteAccount(id)
}
</script>

<style scoped>
.account-form {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-button:hover {
  background: #0056b3;
}

.hint {
  margin-bottom: 20px;
  color: #666;
}

.accounts-list {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px;
  border: 2px dashed #ddd;
  border-radius: 8px;
}
</style>