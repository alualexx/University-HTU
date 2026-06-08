import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { AccountBalance, AttachMoney, ReceiptLong, WarningAmber } from "@mui/icons-material";

export default function DashboardTab({ user, cardSx, gradients }) {
    const stats = [
        { label: "Total Revenue", value: "$1.2M", icon: <AccountBalance />, gradient: gradients[0], suffix: "YTD" },
        { label: "Overdue Payments", value: "$45K", icon: <WarningAmber />, gradient: gradients[2], suffix: "Pending" },
        { label: "Today's Collection", value: "$8.5K", icon: <AttachMoney />, gradient: gradients[1], suffix: "Today" },
        { label: "Invoices Generated", value: "1,240", icon: <ReceiptLong />, gradient: gradients[3], suffix: "This Month" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={900} sx={{ mb: 1, color: "primary.main" }}>
                    Welcome back, {user?.name || "Officer"}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Here's a breakdown of the university's financial status today.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Card sx={{ ...cardSx, borderRadius: 4, position: "relative", overflow: "hidden" }}>
                            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: stat.gradient }} />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Box sx={{ width: 44, height: 44, borderRadius: 3, background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800} textTransform="uppercase">{stat.label}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} sx={{ mt: 1, letterSpacing: -1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                    {stat.suffix}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
