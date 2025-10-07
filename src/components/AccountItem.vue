<template>
  <div class="account-item" :class="{ 'has-error': hasErrors }">
    <!-- Метка -->
    <div class="form-group">
      <label>Метка:</label>
      <input
        type="text"
        v-model="localAccount.label"
        @blur="handleBlur"
        placeholder="Введите метки через ;"
        :class="{ 'error': errors.label }"
        maxlength="50"
      />
      <div v-if="errors.label" class="error-message">
        {{ errors.label }}
      </div>
    </div>

    <!-- Тип записи -->
    <div class="form-group">
      <label>Тип записи:</label>
      <select
        v-model="localAccount.type"
        @change="handleChange"
        :class="{ 'error': errors.type }"
      >
        <option value="LDAP">LDAP</option>
        <option value="Локальная">Локальная</option>
      </select>
    </div>

    <!-- Логин -->
    <div class="form-group">
      <label>Логин <span class="required">*</span>:</label>
      <input
        type="text"
        v-model="localAccount.login"
        @blur="handleBlur"
        placeholder="Введите логин"
        :class="{ 'error': errors.login }"
        maxlength="100"
      />
      <div v-if="errors.login" class="error-message">
        {{ errors.login }}
      </div>
    </div>

    <!-- Пароль (только для локального типа) -->
    <div class="form-group" v-if="localAccount.type === 'Локальная'">
      <label>Пароль <span class="required">*</span>:</label>
      <input
        type="password"
        v-model="localAccount.password"
        @blur="handleBlur"
        placeholder="Введите пароль"
        :class="{ 'error': errors.password }"
        maxlength="100"
      />
      <div v-if="errors.password" class="error-message">
        {{ errors.password }}
      </div>
    </div>

    <!-- Кнопка удаления -->
    <button @click="$emit('delete')" class="delete-button">
      Удалить
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Account } from '../types/account'

interface Props {
  account: Account
}

interface Emits {
  (e: 'update', account: Account): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Локальная копия для редактирования
const localAccount = reactive<Account>({ ...props.account })

// Ошибки валидации
const errors = reactive({
  label: '',
  type: '',
  login: '',
  password: ''
})

// Проверка наличия ошибок
const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== '')
})

// Валидация учетной записи
const validate = (): boolean => {
  // Сбрасываем ошибки
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Валидация логина
  if (!localAccount.login.trim()) {
    errors.login = 'Логин обязателен для заполнения'
    isValid = false
  } else if (localAccount.login.length > 100) {
    errors.login = 'Логин не должен превышать 100 символов'
    isValid = false
  }

  // Валидация метки
  if (localAccount.label.length > 50) {
    errors.label = 'Метка не должна превышать 50 символов'
    isValid = false
  }

  // Валидация пароля для локального типа
  if (localAccount.type === 'Локальная') {
    if (!localAccount.password) {
      errors.password = 'Пароль обязателен для локальной учетной записи'
      isValid = false
    } else if (localAccount.password.length > 100) {
      errors.password = 'Пароль не должен превышать 100 символов'
      isValid = false
    }
  }

  return isValid
}

// Обработчик потери фокуса
const handleBlur = () => {
  if (validate()) {
    emit('update', { ...localAccount })
  }
}

// Обработчик изменения селекта
const handleChange = () => {
  // Для типа LDAP сбрасываем пароль
  if (localAccount.type === 'LDAP') {
    localAccount.password = null
  }
  
  if (validate()) {
    emit('update', { ...localAccount })
  }
}

// Следим за изменениями аккаунта извне
watch(() => props.account, (newAccount) => {
  Object.assign(localAccount, newAccount)
}, { deep: true })
</script>

<style scoped>
.account-item {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  margin-bottom: 20px;
}

.account-item.has-error {
  border-color: #dc3545;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.required {
  color: #dc3545;
}

input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input.error, select.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.delete-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-button:hover {
  background: #c82333;
}
</style>