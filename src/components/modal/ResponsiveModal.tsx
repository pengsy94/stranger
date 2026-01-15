'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from './ResponsiveModal.module.scss';

interface IProps {
  isOpen: boolean,
  onClose: () => void,
  children: React.ReactNode,
  title?: string,
  hideHeader?: boolean,
  footer?: React.ReactNode
}

const ResponsiveModal = ({ isOpen, onClose, children, title = "Modal Title", hideHeader = false, footer = null }: IProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isVisible, setIsVisible] = useState(false);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 关闭动画处理
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // 等待动画完成
  };

  if (!isOpen) return null;

  return (
    <div className={styles['modal-container']}>
      {/* 遮罩层 */}
      <div
        className={`${styles['modal-overlay']} ${isVisible ? styles.action : ''}`}
        onClick={handleClose}
      />

      {/* 弹出层内容 */}
      <div className={`${styles['modal-content-wrapper']} ${isMobile ? styles.mobile : styles.desktop} ${isVisible ? styles.active : ''}`}>
        <div className={styles["modal-content"]}>
          {/* 头部 */}

          {
            !hideHeader && (
              <div className={styles["modal-header"]}>
                <h3 className={styles["modal-title"]}>{title}</h3>
                <button
                  className={styles["modal-close-btn"]}
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            )
          }

          {/* 内容区域 */}
          <div className={styles["modal-body"]}>
            {children}
          </div>

          {/* 底部按钮 */}
          { footer }
          
        </div>
      </div>
    </div>
  );
};

export default ResponsiveModal;