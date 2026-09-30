import React, { useState } from 'react';
import {
    Box, Typography, Card, TextField, Button, Grid, Chip, Divider, Stack, InputAdornment, useTheme, alpha
} from '@mui/material';
import {
    Search, FilterAlt, AutoStories, Computer, School, AccountCircle
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibSearchTab({ glassStyle }) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [filter, setFilter] = useState('all'); // all, physical, digital, thesis

    const handleSearch = async () => {
        if (!searchQuery.trim() && filter === 'all') return;
        setHasSearched(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (filter !== 'all') params.type = filter;

            const res = await libraryAPI.getBooks(params);
            setResults(res.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Advanced OPAC Search</Typography>
                <Typography variant="body2" color="text.secondary">Deep discovery engine across all university collections</Typography>
            </Box>

            <Card sx={{ ...glassStyle, p: 4, borderRadius: 4, mb: 4, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={900} mb={3}>What are you looking for today?</Typography>
                <Box sx={{ display: 'flex', gap: 2, maxWidth: 800, mx: 'auto', mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search keywords, title, author, ISBN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            sx: { borderRadius: 3, bgcolor: 'background.paper', fontSize: '1.1rem', py: 0.5 }
                        }}
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSearch}
                        sx={{ borderRadius: 3, px: 4, fontWeight: 900 }}
                    >
                        Explore
                    </Button>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography variant="body2" fontWeight={700} sx={{ mt: 1 }}>Filter Collection:</Typography>
                    <Chip
                        label="Everything"
                        onClick={() => setFilter('all')}
                        color={filter === 'all' ? 'primary' : 'default'}
                        variant={filter === 'all' ? 'filled' : 'outlined'}
                    />
                    <Chip
                        icon={<AutoStories fontSize="small" />}
                        label="Physical Books"
                        onClick={() => setFilter('physical')}
                        color={filter === 'physical' ? 'primary' : 'default'}
                        variant={filter === 'physical' ? 'filled' : 'outlined'}
                    />
                    <Chip
                        icon={<Computer fontSize="small" />}
                        label="E-Books/Digital"
                        onClick={() => setFilter('digital')}
                        color={filter === 'digital' ? 'primary' : 'default'}
                        variant={filter === 'digital' ? 'filled' : 'outlined'}
                    />
                    <Chip
                        icon={<School fontSize="small" />}
                        label="Thesis/Research"
                        onClick={() => setFilter('thesis')}
                        color={filter === 'thesis' ? 'primary' : 'default'}
                        variant={filter === 'thesis' ? 'filled' : 'outlined'}
                    />
                </Stack>
            </Card>

            {hasSearched && (
                <Box>
                    <Typography variant="h6" fontWeight={800} mb={3}>
                        Search Results ({results.length})
                    </Typography>

                    {results.length === 0 ? (
                        <Card sx={{ ...glassStyle, p: 5, textAlign: 'center', borderRadius: 4 }}>
                            <FilterAlt sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                            <Typography variant="h6" fontWeight={800} color="text.secondary">No matching resources found</Typography>
                            <Typography variant="body2" color="text.secondary">Try broadening your search terms or changing the collection filter.</Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {results.map((item) => (
                                <Grid item xs={12} md={6} lg={4} key={item._id}>
                                    <Card sx={{ ...glassStyle, p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                                            <Chip
                                                size="small"
                                                label={item.type.toUpperCase()}
                                                sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
                                            />
                                            {item.type === 'physical' && (
                                                <Chip
                                                    size="small"
                                                    label={item.availableCopies > 0 ? 'AVAILABLE' : 'CHECKED OUT'}
                                                    sx={{
                                                        fontWeight: 900,
                                                        bgcolor: item.availableCopies > 0 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                                                        color: item.availableCopies > 0 ? '#10b981' : '#ef4444'
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="h6" fontWeight={900} sx={{ mb: 1, lineHeight: 1.2 }}>{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccountCircle fontSize="small" /> {item.author || 'Unknown Author'}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
                                            <b>Category:</b> {item.category || 'General'}
                                            {item.type === 'physical' && ` | Loc: ${item.location || 'Main Stacks'}`}
                                            {item.isbn && <><br /><b>ISBN/ID:</b> {item.isbn}</>}
                                        </Typography>

                                        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                            <Button variant="outlined" size="small" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>View Details</Button>
                                            {item.type !== 'physical' && (
                                                <Button variant="contained" size="small" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Access Now</Button>
                                            )}
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Box>
    );
}
