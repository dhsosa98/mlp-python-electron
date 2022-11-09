import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: 'dark',
    setTheme: (theme: string) => {}
});

export default ThemeContext;

export const ThemeProvider = (props: any) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
      const localTheme = localStorage.getItem('theme');
      if (localTheme) {
        setTheme(localTheme);
      }
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', theme);
      }
    }, []);

    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.style.backgroundColor = '#0f172a';
      } else {
        document.documentElement.classList.remove('dark')
        document.body.style.backgroundColor = '#fff';
      }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }} >
            {props.children}
        </ThemeContext.Provider>
    );
};



