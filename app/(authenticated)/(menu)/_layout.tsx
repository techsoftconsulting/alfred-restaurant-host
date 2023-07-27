import { useTheme } from '@shared/ui/theme/AppTheme';
import { Icon } from '@main-components/Base/Icon';
import * as React from 'react';
import { Tabs } from 'expo-router/tabs';
import { Box } from '@main-components/Base/Box';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';

export const FOOTER_HEIGHT = 65;

const MENU_MAP = {
    'ACCOUNT': {
        route: 'account',
        component: (
                <Tabs.Screen
                        name={'account'}
                        options={{
                            tabBarIcon: (props: any) => (
                                    <Icon
                                            name={'user'}
                                            type={'feather'}
                                            color={props.color ?? 'white'}
                                            numberSize={45}
                                    />
                            ),
                            title: 'Ajustes',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'CREATE': {
        route: 'create',
        component: (
                <Tabs.Screen
                        name={'create'}
                        options={{
                            unmountOnBlur: true,

                            tabBarIcon: (props: any) => (
                                    <Icon
                                            name={'plus-square'}
                                            type={'feather'}
                                            color={props.color ?? 'white'}
                                            numberSize={45}
                                    />
                            ),
                            title: 'Nueva reserva',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'RESERVATIONS': {
        route: 'reservations',
        component: (
                <Tabs.Screen
                        name={'reservations'}
                        options={{
                            tabBarIcon: (props: any) => (
                                    <Icon
                                            name={'ios-calendar-outline'}
                                            type={'ionicon'}
                                            color={props.color ?? 'white'}
                                            numberSize={45}
                                    />
                            ),
                            title: 'Reservas realizadas',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    }
    /*  'SCAN': {
          route: 'scan',
          component: (
                  <Tabs.Screen

                          name={'scan'}
                          options={{
                              unmountOnBlur: true,
                              tabBarIcon: (props: any) => (
                                      <Icon
                                              name={'scan'}
                                              type={'ionicon'}
                                              color={props.color ?? 'white'}
                                              numberSize={45}
                                      />
                              ),
                              title: 'Escanear',
                              headerTitle: '',
                              headerShown: false
                          }}
                  />
          )
      }*/


};

export function useGetUserMenu() {
    return {
        loaded: true,
        menu: ['CREATE', 'SCAN', 'RESERVATIONS', 'ACCOUNT']
    };
}

export function useMenuRoute() {
    return {
        get(key: string) {
            return MENU_MAP[key]?.route as string;
        }
    };
}


export default function Layout() {

    const { loaded, menu } = useGetUserMenu();

    const mappedMenu = Object.keys(MENU_MAP ?? {}).filter(menuKey => menu.includes(menuKey)).map(menu => {
        return MENU_MAP[menu].component;
    });

    return (
            <Tabs
                    tabBar={(props) => <AppTabs {...props} />}
                    screenOptions={{
                        headerShown: false
                    }}
            >
                <Tabs.Screen
                        name={'index'}
                        options={{
                            href: null,
                            unmountOnBlur: true,
                            title: '',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
                {mappedMenu}
            </Tabs>
    );
}

function AppTabs(props: any) {
    const theme = useTheme();

    return (
            <Box
                    height={80}
                    style={{
                        backgroundImage: `linear-gradient(${theme.colors.contrastMain},${theme.colors.contrastLight}) `
                    }}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={'xl'}
            >
                {
                    Object.keys(props.descriptors).filter(el => {
                        const desc = props.descriptors[el];
                        return !!desc.options?.tabBarIcon;
                    }).map(descriptor => {
                        const desc = props.descriptors[descriptor];

                        return (
                                <TouchableOpacity
                                        key={descriptor}
                                        onPress={() => {
                                            props.navigation.navigate(desc.route.name);
                                        }}
                                >
                                    <Box>
                                        {desc.options.tabBarIcon?.({ color: 'white' })}
                                    </Box>
                                </TouchableOpacity>

                        );
                    })
                }

            </Box>
    );
}