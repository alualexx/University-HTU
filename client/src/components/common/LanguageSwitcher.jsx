import React from 'react';
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  Typography, 
  alpha,
  useTheme,
  Menu,
  ListItemText
} from '@mui/material';
import { Language, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';
import { useColorMode } from '../../context/ThemeContext';

const LanguageSwitcher = ({ variant = 'standard' }) => {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const theme = useTheme();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', label: 'US English' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹', label: 'አማርኛ' }
  ];

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (code) => {
    setLanguage(code);
    handleClose();
  };

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  if (variant === 'icon') {
    const selected = languages.find(l => l.code === language);
    return (
      <Box>
        <Box 
          onClick={handleOpen}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer',
            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(25,118,210,0.05)',
            px: 1.5,
            py: 0.5,
            borderRadius: '20px',
            border: `1px solid ${open ? theme.palette.primary.main : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.2)')}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)',
              borderColor: theme.palette.primary.main
            }
          }}
        >
          <Language sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: isDark ? '#fff' : '#1e293b' }}>
            {selected?.code.toUpperCase()} {selected?.name}
          </Typography>
          {open ? <KeyboardArrowUp sx={{ fontSize: 16, opacity: 0.7 }} /> : <KeyboardArrowDown sx={{ fontSize: 16, opacity: 0.7 }} />}
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          elevation={4}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '12px',
              minWidth: 150,
              bgcolor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {languages.map((lang) => (
            <MenuItem 
              key={lang.code} 
              onClick={() => handleSelect(lang.code)}
              selected={language === lang.code}
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.2,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                }
              }}
            >
              <Typography sx={{ fontSize: '1.2rem' }}>{lang.flag}</Typography>
              <ListItemText 
                primary={lang.name} 
                primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }} 
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        bgcolor: isDark ? alpha('#fff', 0.05) : alpha(theme.palette.primary.main, 0.05),
        px: 2,
        py: 0.5,
        borderRadius: 3,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Language sx={{ fontSize: 20, color: isDark ? 'rgba(255,255,255,0.7)' : 'primary.main' }} />
      <Select
        value={language}
        onChange={handleChange}
        variant="standard"
        disableUnderline
        sx={{
          color: isDark ? '#fff' : '#1e293b',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 800,
            fontSize: '0.85rem'
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            value={lang.code}
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '1.1rem' }}>{lang.flag}</Typography>
              <Typography fontWeight={800}>{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
