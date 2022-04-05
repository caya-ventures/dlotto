import { Numbers, Round, Ticket, TicketId, UserTicket } from "../../../declarations/dlotto/dlotto.did";

export const normalizeTicketList = (ticketList: [ bigint, Ticket ][]): Ticket[] => {
    return ticketList.map(([ , info ]) => {
        return info;
    }).sort((a, b) => {
        if (a.round.round === b.round.round) return 0;
        return a.round.round > b.round.round ? 1 : -1;
    });
};

export const roundPrice = (value: number, precision: number = 6): string => {
    return value.toLocaleString(undefined, { maximumFractionDigits: precision });
};

export const randomInt = (max: number): number => Math.floor(Math.random() * max) + 1;

export const randomNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < 5) {
        if (numbers.length === 4) {
            numbers.push(randomInt(10)); // super ball
        } else {
            const candidate = randomInt(24);
            !numbers.includes(candidate) && numbers.push(candidate);
        }
    }
    return numbers;
};

export const randomNumbersArray = (count: number): number[][] => {
    const numbersSet: number[][] = [];
    while (numbersSet.length < count) {
        const numbers = randomNumbers();
        // TODO: add check for existing ticket
        numbersSet.push(numbers);
    }
    return numbersSet;
};

export const toTickets = (numbers: number[][]): Ticket[] => {
    return numbers.map(item => {
        return {
            regular: item.slice(0, 4).map(val => BigInt(val)),
            super: [ BigInt(item[4]) ],
            date_time: BigInt(0),
            entity_id: BigInt(0),
            round: {
                prize_pot: BigInt(0),
                round: BigInt(0),
                finish_at: BigInt(0),
            },
        };
    });
};

export const toUserTickets = (tickets: Partial<Ticket>[]): Partial<UserTicket>[] => {
    return tickets.map((ticket, index) => ({
        ticket: <Ticket>ticket,
        ticket_id: BigInt(index + 1),
    }));
};

export const matchUserTickets = (userTickets: UserTicket[], ticket: Ticket) => {
    let ballMatchCount = 0;
    const ticketIds: bigint[] = [];

    if (!userTickets || !ticket) {
        return { ballMatchCount: 0, ticketIds: [] };
    }

    userTickets?.forEach(userTicket => {
        if (userTicket?.ticket?.super[0] === ticket?.super[0]) {
            ballMatchCount++;
            ticketIds.push(userTicket?.ticket_id);
        }
        const regularMatches = ticket.regular.filter(x => userTicket?.ticket?.regular.includes(x)).length;
        if (regularMatches > 1) {
            ballMatchCount += regularMatches;
            if (!ticketIds.includes(userTicket?.ticket?.entity_id)) {
                ticketIds.push(userTicket?.ticket_id);
            }
        }
    });
    return { ballMatchCount, ticketIds };
};
