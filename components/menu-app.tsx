"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, ArrowLeft, Plus, Minus, Eye, Star } from "lucide-react"
import { ARViewer } from "@/components/ar-viewer"

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
    name: "Paella Valenciana",
    description: "Arroz tradicional con pollo, conejo, judías verdes y azafrán",
    price: 18.5,
    image: "/paella-valenciana-traditional-spanish-rice-dish.jpg",
    category: "Platos Principales",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Gazpacho Andaluz",
    description: "Sopa fría de tomate, pepino, pimiento y ajo",
    price: 8.9,
    image: "/gazpacho-andaluz-cold-tomato-soup.jpg",
    category: "Entrantes",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Pulpo a la Gallega",
    description: "Pulpo cocido con patatas, pimentón dulce y aceite de oliva",
    price: 16.8,
    image: "/pulpo-gallega-octopus-potatoes-paprika.jpg",
    category: "Entrantes",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Crema Catalana",
    description: "Postre tradicional con crema pastelera y azúcar caramelizado",
    price: 6.5,
    image: "/crema-catalana-dessert-caramelized-sugar.jpg",
    category: "Postres",
    rating: 4.7,
  },
  {
    id: "5",
    name: "Sangría de la Casa",
    description: "Vino tinto con frutas frescas y especias",
    price: 12.0,
    image: "/sangria-red-wine-fresh-fruits.jpg",
    category: "Bebidas",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Jamón Ibérico",
    description: "Jamón ibérico de bellota cortado a mano",
    price: 22.0,
    image: "/jamon-iberico-hand-sliced-ham.jpg",
    category: "Entrantes",
    rating: 4.9,
  },
]

const categories = ["Todos", "Entrantes", "Platos Principales", "Postres", "Bebidas"]

export function MenuApp() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [arItem, setArItem] = useState<MenuItem | null>(null)

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
        <div className="sticky top-0 bg-background border-b z-10">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">Carrito</h1>
            <div className="w-16" />
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
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
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
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Restaurante Español</h1>
            <Button variant="outline" size="sm" onClick={() => setShowCart(true)} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar platos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
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
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-24 h-24 object-cover" />
                <div className="flex-1 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-balance">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">€{item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setArItem(item)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver en AR
                    </Button>
                    <Button size="sm" onClick={() => addToCart(item)}>
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
