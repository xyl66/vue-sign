let host='http://10.130.2.95';
const config={
    service:{
        host,
        getCourseInfoUrl:`${host}/v1/coursesign/getCourseInfo`,
        couseSignUrl:`${host}/v1/coursesign/sign`
    }
}
export default config;