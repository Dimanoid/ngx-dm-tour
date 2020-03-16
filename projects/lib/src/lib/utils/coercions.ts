function _isNumberValue(value: any): boolean {
    return !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
}

function coerceCssPixelValue(value: any): string {
    if (value == null) {
      return '';
    }
    return typeof value === 'string' ? value : `${value}px`;
}

export function toBoolean(value: boolean | string): boolean {
    return value != null && `${value}` !== 'false';
}

export function toNumber(value: number | string): number;
export function toNumber<D>(value: number | string, fallback: D): number | D;
export function toNumber(value: number | string, fallbackValue: number = 0): number {
    return _isNumberValue(value) ? Number(value) : fallbackValue;
}

export function toCssPixel(value: number | string): string {
    return coerceCssPixelValue(value);
}

function propDecoratorFactory<T, D>(name: string, fallback: (v: T) => D): (target: any, propName: string) => void {
    function propDecorator(target: any, propName: string): void {
        const privatePropName = `$$__${propName}`;

        if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
            console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
        }

        Object.defineProperty(target, privatePropName, {
            configurable: true,
            writable: true
        });

        Object.defineProperty(target, propName, {
            get(): string {
                return this[privatePropName];
            },
            set(value: T): void {
                this[privatePropName] = fallback(value);
            }
        });
    }

    return propDecorator;
}

export function InputBoolean(): any {
    return propDecoratorFactory('InputBoolean', toBoolean);
}

export function InputCssPixel(): any {
    return propDecoratorFactory('InputCssPixel', toCssPixel);
}

export function InputNumber(): any {
    return propDecoratorFactory('InputNumber', toNumber);
}
