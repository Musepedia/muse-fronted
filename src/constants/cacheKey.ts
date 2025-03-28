const SYSTEM_NAME = "MGS"

/** 缓存数据时用到的 Key */
class CacheKey {
  static TOKEN = `${SYSTEM_NAME}-token-key`
  static SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static COMPONENT_LIST = `${SYSTEM_NAME}-component-list`
  static MANUAL = `${SYSTEM_NAME}-manual`
  static UPLOADEDIMAGES = `${SYSTEM_NAME}-uploaded-images`
}

export default CacheKey
