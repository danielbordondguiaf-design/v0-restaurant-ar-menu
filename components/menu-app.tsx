"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, ArrowLeft, Plus, Minus, Eye, Star } from "lucide-react"
import { ARViewer } from "@/components/ar-viewer"
import { ThemeSelector, useTheme } from "@/components/theme-selector"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
}

interface CartItem extends MenuItem {
  quantity: number
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Moqueca",
    description: "Guiso de pescado con leche de coco, aceite de dendê, tomate, cebolla, pimiento y cilantro",
    price: 19.5,
    image: "/moqueca-fish-stew-coconut-milk.jpg",
    category: "Platos Principales",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Acarajé",
    description: "Bollo frito de frijoles carita relleno de vatapá, carurú y salsa de pimienta",
    price: 9.5,
    image: "/acaraje-fried-bean-ball-shrimp.jpg",
    category: "Entrantes",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Vatapá",
    description: "Crema espesa con camarones, leche de coco, aceite de dendê y maní",
    price: 14.5,
    image: "/vatapa-shrimp-cream-coconut.jpg",
    category: "Acompañamientos",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Bobó de Camarão",
    description: "Crema de camarones elaborada con puré de mandioca, leche de coco y aceite de dendê",
    price: 17.0,
    image: "/bobo-camarao-shrimp-cassava-cream.jpg",
    category: "Platos Principales",
    rating: 4.8,
  },
  {
    id: "5",
    name: "Carurú",
    description: "Guiso tradicional con okra, camarones secos y frescos, aceite de palma",
    price: 12.5,
    image: "/caruru-okra-shrimp-stew.jpg",
    category: "Acompañamientos",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Feijoada",
    description: "Clásico plato nacional brasilero con frijoles negros y varias carnes de cerdo",
    price: 16.0,
    image: "/feijoada-black-bean-stew-pork.jpg",
    category: "Platos Principales",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Abará",
    description: "Masa de frijoles cocida al vapor, similar al acarajé pero sin freír",
    price: 8.5,
    image: "/abara-steamed-bean-cake.jpg",
    category: "Entrantes",
    rating: 4.5,
  },
  {
    id: "8",
    name: "Cocadas",
    description: "Dulce tradicional de coco rallado y leche condensada",
    price: 5.5,
    image: "/cocadas-coconut-candy.jpg",
    category: "Postres",
    rating: 4.7,
  },
  {
    id: "9",
    name: "Tapioca",
    description: "Masa de harina de yuca rellena de coco con leche condensada",
    price: 7.0,
    image: "/tapioca-cassava-flour-coconut.jpg",
    category: "Postres",
    rating: 4.6,
  },
]

const categories = ["Todos", "Entrantes", "Platos Principales", "Acompañamientos", "Postres"]

export function MenuApp() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [arItem, setArItem] = useState<MenuItem | null>(null)
  const { theme, setTheme } = useTheme()

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      }
      return prev.filter((cartItem) => cartItem.id !== itemId)
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (arItem) {
    return <ARViewer item={arItem} onBack={() => setArItem(null)} onAddToCart={addToCart} />
  }

  if (showCart) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => setShowCart(false)} className="rounded-2xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold text-primary">Carrito</h1>
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <Card key={item.id} className="rounded-2xl border-0 shadow-md overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">R${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)} className="rounded-xl h-8 w-8 p-0">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => addToCart(item)} className="rounded-xl h-8 w-8 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="rounded-2xl border-0 shadow-md bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-primary">R${getTotalPrice().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full rounded-2xl shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                Realizar Pedido
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Restaurante Bahiano</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowCart(true)} 
                className="relative rounded-2xl hover:bg-muted/50"
              >
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar platos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 rounded-2xl border-0 bg-card shadow-sm h-12"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-2xl ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-card text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden rounded-2xl border-0 shadow-md">
            <CardContent className="p-0">
              <div className="flex">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-28 h-28 object-cover" />
                <div className="flex-1 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground text-balance">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">R${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{item.description}</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="ghost" onClick={() => setArItem(item)} className="rounded-xl text-muted-foreground hover:text-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver en AR
                    </Button>
                    <Button size="sm" onClick={() => addToCart(item)} className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
