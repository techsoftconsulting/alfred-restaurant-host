import { Box } from '@main-components/Base/Box';
import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import { InputWrapperProps } from '@main-components/Form/components/InputWrapper/InputWrapperProps';

export function InputWrapper({ hasError, children, bg, style }: InputWrapperProps) {
    const theme = useTheme();
    return (
            <Box
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={hasError ? 'dangerMain' : 'contrastLight'}
                    bg={bg ?? 'white'}
                    justifyContent='center'
                    overflow={'hidden'}
                    style={style}
            >
                {children}
            </Box>
    );
}
