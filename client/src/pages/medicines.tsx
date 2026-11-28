import { formatINR } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Pill,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Shield,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { MEDICINE_CATEGORIES } from "@shared/schema";
import type { Medicine } from "@shared/schema";

/* ⭐ NEW IMPORT */
import { useCart } from "@/context/CartContext";

/* -------------------- Medicine Card -------------------- */

function MedicineCard({
  medicine,
  addToCart,
}: {
  medicine: Medicine;
  addToCart: (m: Medicine) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover-elevate">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-amber-500/10">
                <Pill className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <CardTitle>{medicine.name}</CardTitle>
                <CardDescription>{medicine.genericName}</CardDescription>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg">{formatINR(medicine.price)}</p>

              {medicine.prescriptionRequired === 1 && (
                <Badge variant="destructive">Rx Required</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{medicine.category}</Badge>
            <Badge variant="outline">{medicine.dosageForm}</Badge>
            <Badge variant="outline">{medicine.strength}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            <b>Manufacturer:</b> {medicine.manufacturer}
          </p>

          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" /> View Details
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 border-t pt-3">
            <div>
              <p className="font-medium flex gap-2 items-center">
                <Info className="w-4 h-4" /> Uses
              </p>
              <p className="text-sm text-muted-foreground">{medicine.uses}</p>
            </div>

            <div>
              <p className="font-medium flex gap-2 items-center">
                <AlertTriangle className="w-4 h-4" /> Side Effects
              </p>
              <p className="text-sm text-muted-foreground">
                {medicine.sideEffects}
              </p>
            </div>

            <div>
              <p className="font-medium flex gap-2 items-center">
                <Shield className="w-4 h-4" /> Precautions
              </p>
              <p className="text-sm text-muted-foreground">
                {medicine.precautions}
              </p>
            </div>

            <Button className="w-full" onClick={() => addToCart(medicine)}>
              Add To Cart
            </Button>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}

/* -------------------- Main Page -------------------- */

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ⭐ GLOBAL CART */
  const { cart, addToCart, removeFromCart, changeQuantity } = useCart();

  /* ⭐ Navigation */
  const [, setLocation] = useLocation();

  /* -------- API -------- */

  const { data: medicines, isLoading, isError } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines"],
  });

  const filteredMedicines = medicines?.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.uses.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "all" || m.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medicine Database</h1>
        </div>

        {/* ⭐ CART BUTTON NAVIGATES PAGE */}
        <Button onClick={() => setLocation("/cart")}>
          Cart ({cart.length})
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MEDICINE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Medicines */}
      <div className="grid md:grid-cols-2 gap-4">
        {isError && <p>Error loading medicines</p>}

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}

        {filteredMedicines?.map((m) => (
          <MedicineCard key={m.id} medicine={m} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
