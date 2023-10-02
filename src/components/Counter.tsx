import { signal } from '@preact/signals';
import './Counter.scss';

type CounterProps = {
    name: string;
    step: number;
};

export const count = signal(0);

export const Counter = ({ name, step }: CounterProps) => {

	const add = () => count.value += step;
	const subtract = () => count.value -= step;

	return (
		<>
            <h5>{name}</h5>
			<div class="counter">
				<button onClick={subtract}>-</button>
				<div>{count.value}</div>
				<button onClick={add}>+</button>
			</div>
		</>
	);
}

