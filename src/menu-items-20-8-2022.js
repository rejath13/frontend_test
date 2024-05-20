const menuItems = {
    items: [
        {
            id: 'navigation',
            title: '',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    icon: 'feather icon-home',
                    type: 'item',
                    url: 'dashboard'
                }
            ]
        },
        
        {
            id: 'customers',
            title: 'Customers',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'customers',
                    title: 'Customers',
                    type: 'item',
                    url: '/customers',
                    classes: 'nav-item',
                    icon: 'fas fa-users'
                }
            ]
        },

        {
            id: 'subscription',
            title: 'Subscription',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'subscription',
                    title: 'Subscription',
                    type: 'item',
                    url: '/subscription',
                    classes: 'nav-item',
                    icon: 'far fa-calendar-alt'
                }
            ]
        },

        {
            id: 'subscription-due',
            title: 'Subscription-Due',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'subscription-due',
                    title: 'Sub. Due',
                    type: 'item',
                    url: '/subscription-due',
                    classes: 'nav-item',
                    icon: 'far fa-calendar-times'
                }
            ]
        },

        {
            id: 'monitoring-due',
            title: 'Monitoring-Due',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'monitoring-due',
                    title: 'Mon. Due',
                    type: 'item',
                    url: '/monitoring-due',
                    classes: 'nav-item',
                    icon: 'fas fa-calendar'
                }
            ]
        },

        {
            id: 'training',
            title: 'Training',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'training',
                    title: 'Training',
                    type: 'item',
                    url: '/training',
                    classes: 'nav-item',
                    icon: 'fas fa-clipboard-list'
                }
            ]
        },

        {
            id: 'blocked-accounts',
            title: 'Blocked-Accounts',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'blocked-accounts',
                    title: 'Blocked',
                    type: 'item',
                    url: '/blocked-accounts',
                    classes: 'nav-item',
                    icon: 'fas fa-ban'
                }
            ]
        },

        {
            id: 'jobs',
            title: 'Jobs',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'jobs',
                    title: 'Jobs',
                    type: 'item',
                    url: '/jobs',
                    classes: 'nav-item',
                    icon: 'fas fa-tasks'
                }
            ]
        },

        {
            id: 'schedule',
            title: 'Schedules',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'schedule',
                    title: 'Schedules',
                    type: 'item',
                    url: '/schedule',
                    classes: 'nav-item',
                    icon: 'fas fa-calendar-day'
                }
            ]
        },

        {
            id: 'vehicles',
            title: 'Vehicles',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'vehicles',
                    title: 'Vehicles',
                    type: 'item',
                    url: '/vehicles',
                    classes: 'nav-item',
                    icon: 'fas fa-car-side'
                }
            ]
        },

        {
            id: 'salesplus',
            title: 'Sales Plus',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'salesplus',
                    title: 'Sales Plus',
                    type: 'item',
                    url: '/salesplus',
                    classes: 'nav-item',
                    icon: 'fas fa-bars'
                }
            ]
        },

        {
            id: 'cold-call',
            title: 'Cold Calling',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'cold-call',
                    title: 'Cold Calling',
                    type: 'item',
                    url: '/cold-call',
                    classes: 'nav-item',
                    icon: 'fas fa-phone'
                }
            ]
        }
        
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
    ]
};

export default menuItems;
