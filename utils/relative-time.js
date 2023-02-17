import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTimePlugin);

export function timeFrom(from) {
    return dayjs().to(dayjs(new Date(from)));
}
