// TODO: will be useful if and wehn we have an API server
export class ApiError extends Error {
    info: unknown;
    status: number;

    constructor(message: string, info: unknown, status: number) {
        super(message);
        this.info = info;
        this.status = status;
    }
}

export const simpleFetcher = async (...args: unknown[]) => {
    // @ts-expect-error args is any, but should be a valid fetch arguments
    const res = await fetch(...args)
    if (!res.ok) {
        const info = await res.json()
        throw new ApiError(
            `An error occurred while fetching the data: ${res.statusText}`,
            info,
            res.status
        )
    }

    return res.json()
}