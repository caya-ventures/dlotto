export interface HowToItem {
    mark: string;
    title: string;
    text: string;
    bgImg: string;
}

export const howToItems: HowToItem[] = [
    {
        mark: '1',
        title: 'Buy tickets',
        text: 'Prices are set when the round starts, equal to 0.1 ICP per ticket.',
        bgImg: 'assets/howto/price.png',
    },
    {
        mark: '2',
        title: 'Wait for the Draw',
        text: 'There is one draw every day. Participate to win jackpot.',
        bgImg: 'assets/howto/wait.png',
    },
    {
        mark: '3',
        title: 'Check for Prizes',
        text: 'Once the round’s over, come back to the page and check the results.',
        bgImg: 'assets/howto/win.png',
    },
];