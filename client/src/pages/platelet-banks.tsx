import { formatINR } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock,
  Activity,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { PlateletBank } from "@shared/schema";

export default function PlateletBanks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const { data: plateletBanks, isLoading, isError } = useQuery<PlateletBank[]>({
    queryKey: ["/api/platelet-banks"],
  });

  const filteredBanks = plateletBanks?.filter((bank) => {
    const matchesSearch = 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || bank.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(plateletBanks?.map((b) => b.city) || [])];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-purple-500/10">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Platelet Banks</h1>
            <p className="text-muted-foreground">
              Find platelet donation centers with pricing information
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search platelet banks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-platelet-banks"
          />
        </div>
        
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-city">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          `Showing ${filteredBanks?.length || 0} platelet banks`
        )}
      </div>

      {/* Platelet Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isError ? (
          <div className="col-span-full text-center py-12">
            <div className="text-destructive">
              <p className="text-lg font-medium mb-1">Failed to load platelet banks</p>
              <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
            </div>
          </div>
        ) : isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredBanks?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium mb-1">No platelet banks found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          filteredBanks?.map((bank) => (
            <Card key={bank.id} className="hover-elevate" data-testid={`card-platelet-bank-${bank.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-purple-500/10">
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      {bank.availability24x7 === 1 && (
                        <Badge variant="secondary" className="mt-1 gap-1">
                          <Clock className="w-3 h-3" />
                          24/7 Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price/Unit</div>
                    <div className="text-xl font-bold text-primary">{formatINR(bank.pricePerUnit)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{bank.address}, {bank.city}, {bank.state}</span>
                </div>

                {bank.plateletTypes && bank.plateletTypes.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Available Platelet Types</div>
                    <div className="flex flex-wrap gap-1">
                      {bank.plateletTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" className="flex-1" data-testid={`button-call-platelet-bank-${bank.id}`}>
                    <Phone className="w-4 h-4 mr-1" />
                    {bank.phone}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
