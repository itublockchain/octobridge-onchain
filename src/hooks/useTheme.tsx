import { useDispatch } from "react-redux";
import { useTypedSelector } from "store";
import { setTheme } from "store/slicers/global";
import { ThemeTypes } from "types/theme";

export const useTheme = () => {
  const { theme } = useTypedSelector((state) => state.global);
  const dispatch = useDispatch();

  const toggleTheme: () => void = () => {
    const to = theme === ThemeTypes.dark ? ThemeTypes.light : ThemeTypes.dark;
    dispatch(setTheme(to));
    localStorage.setItem("theme", to);
  };

  return {
    toggleTheme,
    currentTheme: theme,
  };
};
