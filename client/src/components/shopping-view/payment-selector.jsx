// client/src/components/shopping-view/payment-selector.jsx

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/ui/icons";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const PaymentSelector = ({ onSelect, disabled }) => {
    const [selected, setSelected] = useState('paypal');

    const handleChange = (value) => {
        setSelected(value);
        onSelect(value);
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <RadioGroup
                value={selected}
                onValueChange={handleChange}
                className="grid gap-4"
                disabled={disabled}
            >
                <div className="relative">
                    <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor="paypal"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                    >
                        <div className="flex items-center gap-4">
                            <Icons.paypal className="h-6 w-6" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">PayPal</p>
                                <p className="text-sm text-muted-foreground">
                                    Pay securely with PayPal
                                </p>
                            </div>
                        </div>
                    </Label>
                </div>

                <div className="relative">
                    <RadioGroupItem
                        value="stripe"
                        id="stripe"
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor="stripe"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                    >
                        <div className="flex items-center gap-4">
                            <Icons.creditCard className="h-6 w-6" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Credit Card</p>
                                <p className="text-sm text-muted-foreground">
                                    Pay with Stripe
                                </p>
                            </div>
                        </div>
                    </Label>
                </div>

                <div className="relative">
                    <RadioGroupItem
                        value="paystack"
                        id="paystack"
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor="paystack"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                    >
                        <div className="flex items-center gap-4">
                            <Icons.bank className="h-6 w-6" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Paystack</p>
                                <p className="text-sm text-muted-foreground">
                                    Pay with Paystack
                                </p>
                            </div>
                        </div>
                    </Label>
                </div>
            </RadioGroup>
        </Card>
    );
};

export default PaymentSelector;