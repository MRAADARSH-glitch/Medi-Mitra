import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [success, setSuccess] = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)




  const placeOrder = () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Fill all details");
      return;
    }

    setSuccess(true);
  };

  if (success)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Order Completed
        </h1>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <CardTitle>🛒 Cart</CardTitle>

        {cart.length === 0 && <p>No items</p>}

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between py-3 border-b">
            <div>
              <p>{item.name}</p>
              <p>
                {formatINR(item.price)} × {item.quantity}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => changeQuantity(item.id, "dec")}>
                -
              </Button>

              <Button size="sm" onClick={() => changeQuantity(item.id, "inc")}>
                +
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        <p className="text-right font-bold mt-4">
          Total: {formatINR(total)}
        </p>

        <div className="space-y-3 mt-6">
          <Input
            placeholder="Name"
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <Input
            placeholder="Phone"
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <Input
            placeholder="Address"
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />

          <Button className="w-full" onClick={placeOrder}>
            Place Order
          </Button>
        </div>
      </Card>
    </div>
  );
}
