import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * SlideTabs — animated underline that floats between active/hovered links.
 * items: [{ label: string, to: string }]
 */
export const SlideTabs = ({ items = [] }) => {
  const { pathname } = useLocation();
  const tabsRef = useRef([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });

  const activeIndex = (() => {
    const exact = items.findIndex((item) => item.to === pathname);
    if (exact !== -1) return exact;
    const prefix = items.findIndex(
      (item) => item.to !== '/' && pathname.startsWith(item.to)
    );
    return prefix !== -1 ? prefix : -1;
  })();

  const moveTo = (index) => {
    const tab = tabsRef.current[index];
    if (!tab) return;
    setUnderline({ left: tab.offsetLeft, width: tab.offsetWidth, opacity: 1 });
  };

  useEffect(() => {
    if (activeIndex === -1) {
      setUnderline((u) => ({ ...u, opacity: 0 }));
    } else {
      moveTo(activeIndex);
    }
  }, [activeIndex, items.length]);

  return (
    <ul
      className="relative flex items-center gap-8"
      onMouseLeave={() => moveTo(activeIndex)}
    >
      {items.map((item, i) => (
        <li
          key={item.to}
          ref={(el) => (tabsRef.current[i] = el)}
          onMouseEnter={() => moveTo(i)}
        >
          <Link
            to={item.to}
            className="text-sm font-medium whitespace-nowrap block py-1 text-gray-800"
          >
            {item.label}
          </Link>
        </li>
      ))}

      <motion.div
        animate={{ left: underline.left, width: underline.width, opacity: underline.opacity }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute bottom-0 h-0.5 bg-[#81A6C6] rounded-full pointer-events-none"
      />
    </ul>
  );
};
