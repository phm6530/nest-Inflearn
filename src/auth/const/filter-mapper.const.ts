import { MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';

export const FILTER_MAPPER = {
    more_than: MoreThan,
    less_than: LessThan,
    more_than_equal: MoreThanOrEqual,
};
