const menuItems = {
  items: [
    /* Commented by Sandeep */
    {
      id: "navigation",
      title: "",
      type: "group",
      icon: "icon-navigation",
      children: [
        {
          id: "dashboard",
          title: "Dashboard",
          icon: "feather icon-home",
          type: "item",
          url: "/dashboard",
        },
      ],
    },

    {
      id: "customers",
      title: "Customers",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "customers",
          title: "Customers",
          type: "item",
          url: "/customers",
          classes: "nav-item",
          icon: "fas fa-users",
        },
      ],
    },
    {
      id: "securepath",
      title: "securepath",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "securepath",
          title: "securepath",
          type: "item",
          url: "/securepath",
          classes: "nav-item",
          icon: "fas fa-users",
        },
      ],
    },
    {
      id: "subscription",
      title: "Subscription",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "subscription",
          title: "Subscription",
          type: "item",
          url: "/subscription",
          classes: "nav-item",
          icon: "far fa-calendar-alt",
        },
      ],
    },

    {
      id: "subscription-due",
      title: "Subscription-Due",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "subscription-due",
          title: "Sub. Due",
          type: "item",
          url: "/subscription-due",
          classes: "nav-item",
          icon: "far fa-calendar-times",
        },
      ],
    },

    {
      id: "monitoring-due",
      title: "Monitoring-Due",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "monitoring-due",
          title: "Mon. Due",
          type: "item",
          url: "/monitoring-due",
          classes: "nav-item",
          icon: "fas fa-calendar",
        },
      ],
    },

    {
      id: "training",
      title: "Training",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "training",
          title: "Training",
          type: "item",
          url: "/training",
          classes: "nav-item",
          icon: "fas fa-clipboard-list",
        },
      ],
    },

    {
      id: "blocked-accounts",
      title: "Blocked-Accounts",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "blocked-accounts",
          title: "Blocked",
          type: "item",
          url: "/blocked-accounts",
          classes: "nav-item",
          icon: "fas fa-ban",
        },
      ],
    },

    {
      id: "vehicles",
      title: "Vehicles",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "vehicles",
          title: "Vehicles",
          type: "item",
          url: "/vehicles",
          classes: "nav-item",
          icon: "fas fa-car-side",
        },
      ],
    },


    {
      id: "securepath-vehicles",
      title: "secure vehicle",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "securepath-vehicles",
          title: "secure vehicle",
          type: "item",
          url: "/securepath-vehicles",
          classes: "nav-item",
          icon: "fas fa-car-side",
        },
      ],
    },
    /* commented by sandeep */
    // {
    //   id: "schedule",
    //   title: "Schedules",
    //   type: "group",
    //   icon: "icon-support",
    //   children: [
    //     {
    //       id: "schedule",
    //       title: "Schedules",
    //       type: "item",
    //       url: "/schedule",
    //       classes: "nav-item",
    //       icon: "fas fa-calendar-day",
    //     },
    //   ],
    // },

    {// jobs-sandeep
      id: "jobs",
      title: "Jobs",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "jobs",
          title: "Jobs",
          type: "item",
          url: "/jobs",
          classes: "nav-item",
          icon: "fas fa-tasks",
        },
      ],
    },
    {
      id: "scheduler",
      title: "Scheduler",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "scheduler",
          title: "Scheduler",
          type: "item",
          url: "/scheduler",
          classes: "nav-item",
          icon: "fas fa-tasks",
        },
      ],
    },
    // {
    //   id: "mail-sandeep",
    //   title: "Mail Sandeep",
    //   type: "group",
    //   icon: "icon-support",
    //   children: [
    //     {
    //       id: "mail-sandeep",
    //       title: "Mail Sandeep",
    //       type: "item",
    //       url: "/mail-sandeep",
    //       classes: "nav-item",
    //       icon: "fas fa-tasks",
    //     },
    //   ],
    // },

    // {
    //   id: "jobs",
    //   title: "Jobs",
    //   type: "group",
    //   icon: "icon-support",
    //   children: [
    //     {
    //       id: "jobs",
    //       title: "Jobs",
    //       type: "item",
    //       url: "/jobs",
    //       classes: "nav-item",
    //       icon: "fas fa-tasks",
    //     },
    //   ],
    // },

    {
      id: "salesplus",
      title: "Sales Plus",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "salesplus",
          title: "Sales Plus",
          type: "item",
          url: "/salesplus",
          classes: "nav-item",
          icon: "fas fa-bars",
        },
      ],
    },

    {
      id: "mail",
      title: "Mail",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "mail",
          title: "Mail",
          type: "item",
          url: "/mail",
          classes: "nav-item",
          icon: "fas fa-envelope",
        },
      ],
    },

    {
      id: "itc",
      title: "ASATEEL",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "itc",
          title: "ASATEEL",
          type: "item",
          url: "/itc",
          classes: "nav-item",
          icon: "fas fa-briefcase",
        },
      ],
    },

    {
      id: "cold-call",
      title: "Cold Calling",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "cold-call",
          title: "Cold Calling",
          type: "item",
          url: "/cold-call",
          classes: "nav-item",
          icon: "fas fa-phone",
        },
      ],
    },

    {
      id: "door-door",
      title: "Door to Door",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "door-door",
          title: "Door to Door",
          type: "item",
          url: "/door-door",
          classes: "nav-item",
          icon: "fas fa-shipping-fast",
        },
      ],
    },

    {
      id: "customer-service",
      title: "Services",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "customer-service",
          title: "Services",
          type: "item",
          url: "/customer-service",
          classes: "nav-item",
          icon: "fas fa-tasks",
        },
      ],
    },

    {
      id: "sim-management",
      title: "Sim Management",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "sim-management",
          title: "Sim Management",
          type: "item",
          url: "/sim-management",
          classes: "nav-item",
          icon: "fas fa-tasks",
        },
      ],
    },

    //payments rishikesh
    {
      id: "payments",
      title: "Payments",
      type: "group",
      icon: "icon-support",
      children: [
        {
          id: "payments",
          title: "Payments",
          type: "item",
          url: "/payments",
          classes: "nav-item",
          icon: "fas fa-solid fa-money-check",
        },
      ],
    },

    // {
    //     id: 'items',
    //     title: 'Items',
    //     type: 'group',
    //     icon: 'icon-support',
    //     children: [
    //         {
    //             id: 'items',
    //             title: 'Items',
    //             type: 'item',
    //             url: '/items',
    //             classes: 'nav-item',
    //             icon: 'far fa-list-alt'
    //         }
    //     ]
    // }
  ],
};

export default menuItems;
