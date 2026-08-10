
export const examples: Record<string, [string, string]> = {
    coffee: ["A G (pay -> E X coffee)",
        `gstart[]
gpay[pay]
gtea[tea]
gcoffee[coffee]
gstart gpay
gpay gtea
gpay gcoffee
gtea gstart
gcoffee gstart

bstart
btpay[pay]
bcpay[pay]
btea[tea]
bcoffee[coffee]
bstart btpay
bstart bcpay
btpay btea
bcpay bcoffee
btea bstart
bcoffee bstart
`
    ]

}

