import { formatINR } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  MapPin, 
  Phone, 
  TestTube,
  DollarSign,
  Award,
  CheckCircle,
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
import type { SpermBank } from "@shared/schema";

export default function SpermBanks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const { data: spermBanks, isLoading, isError } = useQuery<SpermBank[]>({
    queryKey: ["/api/sperm-banks"],
  });

  const filteredBanks = spermBanks?.filter((bank) => {
    const matchesSearch = 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || bank.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(spermBanks?.map((b) => b.city) || [])];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-cyan-500/10">
            <TestTube className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sperm Banks</h1>
            <p className="text-muted-foreground">
              Find accredited sperm banks and fertility centers
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
            placeholder="Search sperm banks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-sperm-banks"
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
          `Showing ${filteredBanks?.length || 0} sperm banks`
        )}
      </div>

      {/* Sperm Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isError ? (
          <div className="col-span-full text-center py-12">
            <div className="text-destructive">
              <p className="text-lg font-medium mb-1">Failed to load sperm banks</p>
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
              <p className="text-lg font-medium mb-1">No sperm banks found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          filteredBanks?.map((bank) => (
            <Card key={bank.id} className="hover-elevate" data-testid={`card-sperm-bank-${bank.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-cyan-500/10">
                      <TestTube className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      {bank.accreditation && (
                        <Badge variant="secondary" className="mt-1 gap-1">
                          <Award className="w-3 h-3" />
                          {bank.accreditation}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price/Vial</div>
                    <div className="text-xl font-bold text-primary">{formatINR(bank.pricePerVial)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{bank.address}, {bank.city}, {bank.state}</span>
                </div>

                {bank.services && bank.services.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Services Offered</div>
                    <div className="flex flex-wrap gap-1">
                      {bank.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" className="flex-1" data-testid={`button-call-sperm-bank-${bank.id}`}>
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
