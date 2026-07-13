export declare const slash: {
    cardSelect: {
        general: {
            groups: ({
                type: string;
                show: string;
                items: string[];
                readonly title?: string;
                name?: undefined;
            } | {
                readonly title: string;
                name: string;
                type: string;
                items: (string | {
                    name: string;
                    allowSelector: boolean;
                })[];
                show?: undefined;
            } | {
                readonly title: string;
                name: string;
                type: string;
                items: (string | {
                    name: string;
                    childMenus: string[];
                })[];
                show?: undefined;
            })[];
        };
        table: {
            groups: ({
                type: string;
                show: string;
                items: string[];
                readonly title?: string;
                name?: undefined;
            } | {
                readonly title: string;
                name: string;
                type: string;
                items: string[];
                show?: undefined;
            })[];
        };
    };
};
