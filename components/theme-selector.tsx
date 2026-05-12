"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, X, Check, Palette, ChevronRight, ChevronLeft, Globe, Moon } from "lucide-react"

export type ThemeName = "atardecer" | "bio-organic" | "vibrancia" | "dark"
export type LanguageCode = "es" | "pt" | "en"

interface ThemeOption {
  id: ThemeName
  name: Record<LanguageCode, string>
  description: Record<LanguageCode, string>
  colors: {
    background: string
    primary: string
    accent: string
    secondary: string
  }
}

interface LanguageOption {
  id: LanguageCode
  name: string
  flag: string
}

const languages: LanguageOption[] = [
  { id: "es", name: "Español", flag: "🇦🇷" },
  { id: "pt", name: "Português", flag: "🇧🇷" },
  { id: "en", name: "English", flag: "🇺🇸" },
]

const themes: ThemeOption[] = [
  {
    id: "atardecer",
    name: {
      es: "Atardecer en Itacaré",
      pt: "Pôr do Sol em Itacaré",
      en: "Itacaré Sunset",
    },
    description: {
      es: "Moderna y sofisticada, estilo Coastal Minimalist",
      pt: "Moderna e sofisticada, estilo Coastal Minimalist",
      en: "Modern and sophisticated, Coastal Minimalist style",
    },
    colors: {
      background: "#FDFBF7",
      primary: "#0A4D68",
      accent: "#FF8E72",
      secondary: "#2D5A27",
    },
  },
  {
    id: "bio-organic",
    name: {
      es: "Bio-Organic",
      pt: "Bio-Orgânico",
      en: "Bio-Organic",
    },
    description: {
      es: "Frescura y naturaleza, ideal para ingredientes frescos",
      pt: "Frescor e natureza, ideal para ingredientes frescos",
      en: "Fresh and natural, ideal for fresh ingredients",
    },
    colors: {
      background: "#F4F1EA",
      primary: "#1B4332",
      accent: "#FFB703",
      secondary: "#BC6C25",
    },
  },
  {
    id: "vibrancia",
    name: {
      es: "Vibrancia Bahiana",
      pt: "Vibrância Baiana",
      en: "Bahian Vibrancy",
    },
    description: {
      es: "Alegre pero equilibrada, colores cálidos",
      pt: "Alegre mas equilibrada, cores quentes",
      en: "Cheerful but balanced, warm colors",
    },
    colors: {
      background: "#FFFFFF",
      primary: "#00B4D8",
      accent: "#FB8500",
      secondary: "#1D1D1D",
    },
  },
  {
    id: "dark",
    name: {
      es: "Noche Tropical",
      pt: "Noite Tropical",
      en: "Tropical Night",
    },
    description: {
      es: "Elegante modo oscuro, sofisticado y cálido",
      pt: "Elegante modo escuro, sofisticado e quente",
      en: "Elegant dark mode, sophisticated and warm",
    },
    colors: {
      background: "#0D0D0D",
      primary: "#D4A574",
      accent: "#E8927C",
      secondary: "#B8704D",
    },
  },
]

// Translations for UI elements
const translations = {
  es: {
    settings: "Configuración",
    customize: "Personaliza tu experiencia",
    themeManager: "Gestor de Temas",
    selectTheme: "Seleccionar tema",
    chooseVisualStyle: "Elige el estilo visual de tu menú",
    language: "Idioma",
    selectLanguage: "Seleccionar idioma",
    chooseLanguage: "Elige tu idioma preferido",
    moreOptions: "Más opciones próximamente",
    back: "Volver",
    cart: "Carrito",
    emptyCart: "Tu carrito está vacío",
    total: "Total",
    placeOrder: "Realizar Pedido",
    searchPlates: "Buscar platos...",
    viewInAR: "Ver en AR",
    add: "Añadir",
    all: "Todos",
    starters: "Entrantes",
    mainCourses: "Platos Principales",
    sides: "Acompañamientos",
    desserts: "Postres",
    restaurantName: "Restaurante Bahiano",
  },
  pt: {
    settings: "Configurações",
    customize: "Personalize sua experiência",
    themeManager: "Gerenciador de Temas",
    selectTheme: "Selecionar tema",
    chooseVisualStyle: "Escolha o estilo visual do seu menu",
    language: "Idioma",
    selectLanguage: "Selecionar idioma",
    chooseLanguage: "Escolha seu idioma preferido",
    moreOptions: "Mais opções em breve",
    back: "Voltar",
    cart: "Carrinho",
    emptyCart: "Seu carrinho está vazio",
    total: "Total",
    placeOrder: "Fazer Pedido",
    searchPlates: "Buscar pratos...",
    viewInAR: "Ver em AR",
    add: "Adicionar",
    all: "Todos",
    starters: "Entradas",
    mainCourses: "Pratos Principais",
    sides: "Acompanhamentos",
    desserts: "Sobremesas",
    restaurantName: "Restaurante Baiano",
  },
  en: {
    settings: "Settings",
    customize: "Customize your experience",
    themeManager: "Theme Manager",
    selectTheme: "Select theme",
    chooseVisualStyle: "Choose the visual style of your menu",
    language: "Language",
    selectLanguage: "Select language",
    chooseLanguage: "Choose your preferred language",
    moreOptions: "More options coming soon",
    back: "Back",
    cart: "Cart",
    emptyCart: "Your cart is empty",
    total: "Total",
    placeOrder: "Place Order",
    searchPlates: "Search dishes...",
    viewInAR: "View in AR",
    add: "Add",
    all: "All",
    starters: "Starters",
    mainCourses: "Main Courses",
    sides: "Sides",
    desserts: "Desserts",
    restaurantName: "Bahian Restaurant",
  },
}

// Language Context
interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: keyof typeof translations.es) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bahian-language") as LanguageCode
    if (savedLanguage && languages.some((l) => l.id === savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem("bahian-language", lang)
  }

  const t = (key: keyof typeof translations.es) => {
    return translations[language][key]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      language: "es" as LanguageCode,
      setLanguage: () => {},
      t: (key: keyof typeof translations.es) => translations.es[key],
    }
  }
  return context
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("atardecer")

  useEffect(() => {
    const savedTheme = localStorage.getItem("bahian-theme") as ThemeName
    if (savedTheme && themes.some((t) => t.id === savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("bahian-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return { theme, setTheme, themes }
}

interface ThemeSelectorProps {
  currentTheme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

type SettingsView = "main" | "themes" | "language"

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<SettingsView>("main")
  const { language, setLanguage, t } = useLanguage()

  const handleClose = () => {
    setIsOpen(false)
    setCurrentView("main")
  }

  const currentThemeData = themes.find((t) => t.id === currentTheme)
  const currentLanguageData = languages.find((l) => l.id === language)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-2xl hover:bg-muted/50"
        aria-label={t("settings")}
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50" 
          onClick={handleClose}
        >
          <div className="min-h-full flex items-center justify-center p-6">
            <Card 
              className="w-full max-w-md rounded-3xl shadow-2xl border-0 bg-card animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
            {currentView === "main" ? (
              <>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{t("settings")}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="rounded-full hover:bg-muted/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("customize")}</p>
                </CardHeader>
                <CardContent className="space-y-2 pb-6">
                  {/* Theme Option */}
                  <button
                    onClick={() => setCurrentView("themes")}
                    className="w-full p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          {currentTheme === "dark" ? (
                            <Moon className="h-5 w-5 text-primary" />
                          ) : (
                            <Palette className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium block">{t("themeManager")}</span>
                          <span className="text-xs text-muted-foreground">
                            {currentThemeData?.name[language] || t("selectTheme")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {currentThemeData &&
                            Object.values(currentThemeData.colors)
                              .slice(0, 3)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>

                  {/* Language Option */}
                  <button
                    onClick={() => setCurrentView("language")}
                    className="w-full p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium block">{t("language")}</span>
                          <span className="text-xs text-muted-foreground">
                            {currentLanguageData?.name || t("selectLanguage")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currentLanguageData?.flag}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                </CardContent>
              </>
            ) : currentView === "themes" ? (
              <>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentView("main")}
                        className="rounded-full hover:bg-muted/50 -ml-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{t("themeManager")}</CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="rounded-full hover:bg-muted/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    {t("chooseVisualStyle")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 pb-6 pt-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        onThemeChange(themeOption.id)
                        handleClose()
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        currentTheme === themeOption.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{themeOption.name[language]}</span>
                            {currentTheme === themeOption.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{themeOption.description[language]}</p>
                          <div className="flex gap-1.5 mt-2">
                            {Object.values(themeOption.colors).map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentView("main")}
                        className="rounded-full hover:bg-muted/50 -ml-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{t("language")}</CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="rounded-full hover:bg-muted/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    {t("chooseLanguage")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 pb-6 pt-2">
                  {languages.map((langOption) => (
                    <button
                      key={langOption.id}
                      onClick={() => {
                        setLanguage(langOption.id)
                        handleClose()
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        language === langOption.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{langOption.flag}</span>
                          <span className="font-medium">{langOption.name}</span>
                        </div>
                        {language === langOption.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </>
            )}
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
