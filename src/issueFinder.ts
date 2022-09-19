export function findIssueNumber(message: string): string {
    let parts = message.split(" ")
    const sameRepoRegex = new RegExp('^#\\d+$', 'g')
    const externalRepoRegex = new RegExp(`^[a-zA-Z0-9\\-]+/[a-zA-Z0-9\\-]+/#\\d+$`, 'g')
    for (let part of parts) {
        console.log(sameRepoRegex.test(part))
        if (sameRepoRegex.test(part)) {
            return part
        }
        externalRepoRegex.test(part)
        if (externalRepoRegex.test(part)) {
            return part
        }
    }
    throw Error("Missing issue number in last commit message")
}