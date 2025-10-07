<template>
  <tr class="account-item">
    <td class="account-item__cell account-item__cell--label">
      <div class="account-item__field">
        <input
          type="text"
          v-model="labelString"
          @blur="handleBlur"
          placeholder="Метки через ;"
          class="form-control"
          :class="{ 
            'is-invalid': errors.label
          }"
          maxlength="50"
        />
      </div>
    </td>

    <td class="account-item__cell account-item__cell--type">
      <div class="account-item__field">
        <select
          v-model="localAccount.type"
          @change="handleChange"
          class="form-select"
          :class="{ 
            'is-invalid': errors.type
          }"
        >
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>
    </td>

    <td class="account-item__cell account-item__cell--login">
      <div class="account-item__field">
        <input
          type="text"
          v-model="localAccount.login"
          @blur="handleBlur"
          placeholder="Логин"
          class="form-control"
          :class="{ 
            'is-invalid': errors.login
          }"
          maxlength="100"
        />
      </div>
    </td>

    <td class="account-item__cell account-item__cell--password">
      <div class="account-item__field" v-if="localAccount.type === 'Локальная'">
        <div class="account-item__password-wrapper input-group">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="localAccount.password"
            @blur="handleBlur"
            placeholder="Пароль"
            class="form-control"
            :class="{ 
              'is-invalid': errors.password
            }"
            maxlength="100"
          />
          <button
            type="button"
            class="account-item__password-toggle btn btn-outline-secondary"
            @click="togglePasswordVisibility"
            :title="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
          >
            <span v-if="isPasswordVisible" class="account-item__password-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
              </svg>
            </span>
            <span v-else class="account-item__password-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div v-else class="account-item__password-placeholder">
        —
      </div>
    </td>

    <td class="account-item__cell account-item__cell--actions">
      <button 
        @click="$emit('delete')" 
        class="account-item__delete-button btn btn-danger btn-sm"
      >
        Удалить
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAccountStore } from '../stores/account'
import type { Account, AccountLabel } from '../types/account'

interface Props {
  account: Account
}

interface Emits {
  (e: 'update', account: Account): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const accountStore = useAccountStore()

const localAccount = reactive<Account>({ ...props.account })
const isPasswordVisible = ref(false)

const labelString = ref('')

const initializeLabelString = () => {
  labelString.value = labelsToString(localAccount.labels)
  validate()
}

const labelsToString = (labels: AccountLabel[]): string => {
  return labels.map(label => label.text).join('; ')
}

const errors = reactive({
  label: false,
  type: false,
  login: false,
  password: false
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const validate = (): boolean => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = false
  })

  let isValid = true

  if (!localAccount.login.trim()) {
    errors.login = true
    isValid = false
  } else if (localAccount.login.length > 100) {
    errors.login = true
    isValid = false
  }

  if (labelString.value.length > 50) {
    errors.label = true
    isValid = false
  }

  if (localAccount.type === 'Локальная') {
    if (!localAccount.password) {
      errors.password = true
      isValid = false
    } else if (localAccount.password.length > 100) {
      errors.password = true
      isValid = false
    }
  }  
  return isValid
}

const handleBlur = () => {
  localAccount.labels = accountStore.parseLabels(labelString.value)
  
  const isValid = validate()
  if (isValid) {
    emit('update', { ...localAccount })
  }
}

const handleChange = () => {
  if (localAccount.type === 'LDAP') {
    localAccount.password = null
    isPasswordVisible.value = false
  }
  
  const isValid = validate()
  if (isValid) {
    emit('update', { ...localAccount })
  }
}

initializeLabelString()
</script>

<style scoped>
.account-item--error {
  background-color: rgba(220, 53, 69, 0.05);
}

.account-item--new {
  background-color: rgba(0, 123, 255, 0.05);
}

.account-item__cell {
  vertical-align: middle;
  padding: 12px 8px;
}

.account-item__cell--label {
  min-width: 200px;
}

.account-item__cell--type {
  min-width: 150px;
}

.account-item__cell--login {
  min-width: 200px;
}

.account-item__cell--password {
  min-width: 150px;
}

.account-item__cell--actions {
  min-width: 100px;
  text-align: center;
}

.account-item__field {
  position: relative;
}

.account-item__password-wrapper {
  display: flex;
}

.account-item__password-toggle {
  border: 1px solid #ced4da;
  border-left: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  min-width: 40px;
}

.account-item__password-toggle:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.account-item__password-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-item__password-placeholder {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.account-item__delete-button {
  min-width: 80px;
}

.account-item__password-wrapper .form-control.is-invalid {
  border-right: none;
}

.account-item__password-wrapper .form-control.is-invalid + .account-item__password-toggle {
  border-color: #dc3545;
}

@media (max-width: 768px) {
  .account-item__cell {
    padding: 8px 4px;
  }
  
  .account-item__password-toggle {
    min-width: 35px;
    padding: 0 6px;
  }
}
</style>