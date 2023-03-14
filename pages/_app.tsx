import '../styles/antd.css';
import '../styles/antd-custom.css';
import type { AppProps } from 'next/app';
import React, { useState, ReactNode } from 'react';
import Icon from 'components/Icon/Icon';
import Image from 'next/image';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { MenuItemGroupType } from 'antd/es/menu/hooks/useItems';
import { ItemType } from 'antd/es/menu/hooks/useItems';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: ReactNode,
  key: React.Key,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: 'group',
  href?: ''
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    href,
  } as MenuItem;
}

const FoldButton = () => (
  <div className="h-[32px] w-[32px] relative">
    <Image src={require('../public/left-menu.svg')} fill alt="arrow" />
  </div>
);

const UnfoldButton = () => (
  <div className="h-[18px] w-[18px] relative unfold_button">
    <Image src={require('../public/left-menu.svg')} fill alt="arrow" />
  </div>
);

export default function App({ Component, pageProps }: AppProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const listItem: MenuProps['items'] = [
    {
      label: 'Đơn hàng',
      key: 'order',
      icon: <Icon size={24} icon="order" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/orders/order-online' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/orders/order-online')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đơn hàng online
            </div>
          ),
          key: 'online-order',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/orders/order-offline' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/orders/order-offline')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đơn hàng tại quầy
            </div>
          ),
          key: 'offline-order',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/orders/order-in-app' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/orders/order-in-app')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đơn hàng in-app
            </div>
          ),
          key: 'in-app-order',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/orders/cancel-reason' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/orders/cancel-reason')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Các lý do hủy
            </div>
          ),
          key: 'cancel-reason',
        },
      ],
    },
    {
      label: 'Livestream bán hàng',
      key: 'livestream',
      icon: <Icon size={24} icon="livestream" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/livestreams/livestream-app'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/livestreams/livestream-app')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Livestream trên app
            </div>
          ),
          key: 'livestream-app',
        },
      ],
    },
    {
      label: 'Vận chuyển',
      key: 'transport',
      icon: <Icon size={24} icon="transport" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/transport/transport-company'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/transport/transport-company')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Bật tắt đơn vị vận chuyển
            </div>
          ),
          key: 'transport-company',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/orders/order-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/orders/order-management')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đối soát đơn hàng
            </div>
          ),
          key: 'order-management',
        },
        {
          label: (
            <div
            className={classNames(
              'flex menu_item',
              router.pathname == '/transport/transport-fee'
                ? 'add_bg_white'
                : ''
            )}
              onClick={() =>
                (window.location.href = '/transport/transport-fee')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Phí vận chuyển
            </div>
          ),
          key: 'transport-fee',
        },
      ],
    },
    {
      label: 'Sản phẩm',
      key: 'product',
      icon: <Icon size={24} icon="product-1" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/products' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/products')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Danh sách sản phẩm
            </div>
          ),
          key: 'products',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/products/attribute' ? 'add_bg_white' : ''
              )}
              onClick={() => (window.location.href = '/products/attribute')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Cài đặt thuộc tính
            </div>
          ),
          key: 'product-attribute',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/products/category'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/products/category')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Danh mục sản phẩm
            </div>
          ),
          key: 'product-category',
        },
      ],
    },
    {
      label: 'Khách hàng',
      key: 'customer',
      icon: <Icon size={24} icon="customer" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/customers'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/customers')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Danh sách khách hàng
            </div>
          ),
          key: 'customers',
        },
        {
          label: (
            <div
            className={classNames(
              'flex menu_item',
              router.pathname == '/customers/customer-type'
                ? 'add_bg_white'
                : ''
            )}
              onClick={() =>
                (window.location.href = '/customers/customer-type')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Phân loại khách hàng
            </div>
          ),
          key: 'customer-type',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/customers/customer-level'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/customers/customer-level')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Phân khúc khách hàng
            </div>
          ),
          key: 'customer-level',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/customers/customer-source'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/customers/customer-source')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Nguồn khách hàng
            </div>
          ),
          key: 'customer-source',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/customers/customer-review'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/customers/customer-review')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đánh giá
            </div>
          ),
          key: 'customer-review',
        },
      ],
    },
    {
      label: 'Khuyến mãi',
      key: 'promotions',
      icon: <Icon size={24} icon="transport" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/promotions/promotion-programs'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/promotions/promotion-programs')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Chương trình khuyến mãi
            </div>
          ),
          key: 'promotion-program',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/promotions/combo-promotion'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/promotions/combo-promotion')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Combo
            </div>
          ),
          key: 'combo-promotion',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/promotions/promotion-on-app'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/promotions/promotion-on-app')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Mã khuyến mãi trên App
            </div>
          ),
          key: 'promotion-on-app',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/promotions'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/promotions')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Giá sỉ
            </div>
          ),
          key: 'wholesale-promotion',
        },
      ],
    },
    {
      label: 'Quản lý tồn kho',
      key: 'warehouses',
      icon: <Icon size={24} icon="warehouse-management" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/warehouses/warehouse-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/warehouses/warehouse-management')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Kho
            </div>
          ),
          key: 'warehouse-management',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/warehouses/import-warehouse'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/warehouses/import-warehouse')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Nhập kho
            </div>
          ),
          key: 'import-warehouse',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/warehouses/transfer-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/warehouses/transfer-management')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Chuyển kho
            </div>
          ),
          key: 'transfer-management',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/warehouses/export-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/warehouses/export-management')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Xuất kho
            </div>
          ),
          key: 'export-management',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/warehouses/return-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/warehouses/return-management')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Phiếu trả hàng
            </div>
          ),
          key: 'return-management',
        },
      ],
    },
    {
      label: 'Sổ quỹ',
      key: 'cash-book',
      icon: <Icon size={24} icon="livestream" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/debts-management/list-paymen'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() =>
                (window.location.href = '/debts-management/list-payment')
              }
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Thu chi
            </div>
          ),
          key: 'list-payment',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/debts-management'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/debts-management')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Công nợ
            </div>
          ),
          key: 'debt-management',
        },
      ],
    },
    {
      label: 'Báo cáo & Thông kê',
      key: 'report',
      icon: <Icon size={24} icon="report-1" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Doanh số
            </div>
          ),
          key: 'report-sales',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đơn hàng online+ in-app
            </div>
          ),
          key: 'report-order',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Công nợ
            </div>
          ),
          key: 'report-debt',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Thu chi
            </div>
          ),
          key: 'report-pay',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Sản phẩm
            </div>
          ),
          key: 'report-product',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Khách hàng
            </div>
          ),
          key: 'report-customer',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Vận chuyển
            </div>
          ),
          key: 'report-transport',
        },
      ],
    },
    {
      label: 'Bài viết',
      key: 'blog',
      icon: <Icon size={24} icon="product-1" />,
    },
    {
      label: 'Quản lý mobile app',
      key: 'mobile-app-management',
      icon: <Icon size={24} icon="mobile-app" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Quản lý nội dung trang chủ
            </div>
          ),
          key: 'homepage-management',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Thông báo
            </div>
          ),
          key: 'notification',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Công nợ
            </div>
          ),
          key: 'debt',
        },
      ],
    },
    {
      label: 'Cấu hình',
      key: 'config',
      icon: <Icon size={24} icon="config" />,
      children: [
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Cấu hình hệ thống
            </div>
          ),
          key: 'system-config',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Quản lý người dùng
            </div>
          ),
          key: 'user-managment',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Quản lý phương thức thanh toán
            </div>
          ),
          key: 'pay-method-managment',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Phân quyền hệ thống
            </div>
          ),
          key: 'permission-system',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Lịch sử hệ thống
            </div>
          ),
          key: 'history-system',
        },
        {
          label: (
            <div
              className={classNames(
                'flex menu_item',
                router.pathname == '/report'
                  ? 'add_bg_white'
                  : ''
              )}
              onClick={() => (window.location.href = '/report')}
            >
              <i className="menu-bullet menu-bullet-dot">
                <span></span>
              </i>
              Đổi mật khẩu
            </div>
          ),
          key: 'change-password',
        },
      ],
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex justify-start">
      <div className="flex flex-col !bg-[#1e1e2d]">
        <div className="logo_wrapper">
          <span>
            {collapsed ? (
              ''
            ) : (
              <Image
                src={require('public/logo.png')}
                width={40}
                height={40}
                alt="logo"
              />
            )}
          </span>
          <Button className="!border-0" onClick={toggleCollapsed}>
            {collapsed ? <UnfoldButton /> : <FoldButton />}
          </Button>
        </div>
        <Menu
          className="menu_wrapper"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={listItem}
          onSelect={(line: any) => {
            console.log('line', line.item.props.className);
            line.item.props.className + ' ' + ' add_bg_white';
            console.log('line2', line.item.props.className);

            // window.location.href.includes(line.key)
            //   ? line.item.props.className.concat(' ', 'add_bg_white')
            //   : '';
            // console.log("contain", window.location.href.includes(line.key))
          }}
        />
      </div>
      <div className="px-[16px] py-[32px] w-full">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
