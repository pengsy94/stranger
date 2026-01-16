// 模拟 API 函数
const mockApi = {
    async fetchUserData(userId: number): Promise<{ id: number; name: string }> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { id: userId, name: `用户${userId}` };
    },
};


export default mockApi;