<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ mode === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Social Login Buttons -->
        <div class="space-y-3 mb-6">
          <!-- Facebook Login -->
          <button
            @click="loginWithFacebook"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {{ loading ? 'Đang xử lý...' : 'Tiếp tục với Facebook' }}
          </button>

          <!-- Zalo Login -->
          <button
            @click="loginWithZalo"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <div class="w-5 h-5 mr-3 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">Z</span>
            </div>
            {{ loading ? 'Đang xử lý...' : 'Tiếp tục với Zalo' }}
          </button>

          <!-- Google Login -->
          <button
            @click="loginWithGoogle"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {{ loading ? 'Đang xử lý...' : 'Tiếp tục với Google' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        <!-- Email/Phone Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email/Phone Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ inputType === 'email' ? 'Email' : 'Số điện thoại' }}
            </label>
            <div class="relative">
              <input
                v-model="formData.identifier"
                :type="inputType === 'email' ? 'email' : 'tel'"
                :placeholder="inputType === 'email' ? 'your@email.com' : '0901234567'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
              <button
                type="button"
                @click="toggleInputType"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {{ inputType === 'email' ? 'Dùng SĐT' : 'Dùng Email' }}
              </button>
            </div>
          </div>

          <!-- Password (Login mode) -->
          <div v-if="mode === 'login'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu"
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Name (Register mode) -->
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên hiển thị</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Nhập tên của bạn"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              required
            />
          </div>

          <!-- Terms (Register mode) -->
          <div v-if="mode === 'register'" class="flex items-start space-x-3">
            <input
              v-model="formData.acceptTerms"
              type="checkbox"
              id="terms"
              class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              required
            />
            <label for="terms" class="text-sm text-gray-600">
              Tôi đồng ý với 
              <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-700 font-medium">
                Điều khoản sử dụng
              </NuxtLink>
              và
              <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-700 font-medium">
                Chính sách bảo mật
              </NuxtLink>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký') }}
          </button>
        </form>

        <!-- Mode Switch -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
            <button
              @click="toggleMode"
              class="text-primary-600 hover:text-primary-700 font-medium ml-1"
            >
              {{ mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập' }}
            </button>
          </p>
        </div>

        <!-- Forgot Password (Login mode) -->
        <div v-if="mode === 'login'" class="mt-4 text-center">
          <button
            @click="showForgotPassword = true"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Quên mật khẩu?
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal 
      v-if="showForgotPassword"
      @close="showForgotPassword = false"
      @success="handleForgotPasswordSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  initialMode: {
    type: String,
    default: 'login'
  }
})

const emit = defineEmits(['close', 'success'])

// Reactive state
const mode = ref(props.initialMode)
const inputType = ref('email') // 'email' or 'phone'
const showPassword = ref(false)
const showForgotPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const formData = reactive({
  identifier: '',
  password: '',
  name: '',
  acceptTerms: false
})

// Methods
const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.identifier = ''
  formData.password = ''
  formData.name = ''
  formData.acceptTerms = false
  error.value = ''
  success.value = ''
  showPassword.value = false
}

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  resetForm()
}

const toggleInputType = () => {
  inputType.value = inputType.value === 'email' ? 'phone' : 'email'
  formData.identifier = ''
}

// Social login methods
const loginWithFacebook = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Initialize Facebook SDK if not already done
    if (!window.FB) {
      await loadFacebookSDK()
    }

    // Facebook login
    window.FB.login((response) => {
      if (response.authResponse) {
        handleSocialLogin('facebook', response.authResponse)
      } else {
        error.value = 'Đăng nhập Facebook thất bại'
        loading.value = false
      }
    }, { scope: 'email,public_profile' })

  } catch (err) {
    error.value = 'Lỗi kết nối Facebook'
    loading.value = false
  }
}

const loginWithZalo = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Zalo login implementation
    // Note: This requires Zalo SDK integration
    if (!window.ZaloSocial) {
      error.value = 'Zalo SDK chưa được tải'
      loading.value = false
      return
    }

    window.ZaloSocial.login((response) => {
      if (response.status === 'connected') {
        handleSocialLogin('zalo', response)
      } else {
        error.value = 'Đăng nhập Zalo thất bại'
        loading.value = false
      }
    })

  } catch (err) {
    error.value = 'Lỗi kết nối Zalo'
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Google login implementation
    if (!window.google) {
      await loadGoogleSDK()
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        error.value = 'Đăng nhập Google thất bại'
        loading.value = false
      }
    })

  } catch (err) {
    error.value = 'Lỗi kết nối Google'
    loading.value = false
  }
}

// Handle social login response
const handleSocialLogin = async (provider, authData) => {
  try {
    const response = await $fetch('/api/auth/social-login', {
      method: 'POST',
      body: {
        provider,
        authData
      }
    })

    if (response.success) {
      success.value = 'Đăng nhập thành công!'
      emit('success', response.user)
      setTimeout(() => {
        closeModal()
      }, 1000)
    } else {
      error.value = response.message || 'Đăng nhập thất bại'
    }

  } catch (err) {
    error.value = 'Lỗi server, vui lòng thử lại'
  } finally {
    loading.value = false
  }
}

// Handle form submission
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const endpoint = mode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
    const payload = {
      identifier: formData.identifier,
      type: inputType.value
    }

    if (mode.value === 'login') {
      payload.password = formData.password
    } else {
      payload.name = formData.name
    }

    const response = await $fetch(endpoint, {
      method: 'POST',
      body: payload
    })

    if (response.success) {
      if (mode.value === 'register') {
        success.value = 'Đăng ký thành công! Vui lòng kiểm tra email/SMS để xác thực.'
      } else {
        success.value = 'Đăng nhập thành công!'
        emit('success', response.user)
        setTimeout(() => {
          closeModal()
        }, 1000)
      }
    } else {
      error.value = response.message || 'Có lỗi xảy ra'
    }

  } catch (err) {
    error.value = 'Lỗi kết nối, vui lòng thử lại'
  } finally {
    loading.value = false
  }
}

const handleForgotPasswordSuccess = (message) => {
  showForgotPassword.value = false
  success.value = message
}

// Load external SDKs
const loadFacebookSDK = () => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve()
      return
    }

    window.fbAsyncInit = function() {
      FB.init({
        appId: useRuntimeConfig().public.facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      })
      resolve()
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js'
    document.head.appendChild(script)
  })
}

const loadGoogleSDK = () => {
  return new Promise((resolve) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: useRuntimeConfig().public.googleClientId,
        callback: (response) => {
          handleSocialLogin('google', response)
        }
      })
      resolve()
    }
    document.head.appendChild(script)
  })
}

// Watch for mode changes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    mode.value = props.initialMode
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styles for Vietnamese UI */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .inline-block {
    @apply w-full mx-4;
  }
}
</style>
