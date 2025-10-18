import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className, ...otherProps } = props;
    return (
        <img 
            {...otherProps}
            src="/assets/images/kaupod.png" 
            alt="Kaupod Logo"
            className={className}
        />
    );
}
