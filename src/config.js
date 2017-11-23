//let host='http://esn.foxconn.com';
let host='http://10.130.2.19';
const config={
    service:{
        host,
        getCourseInfoUrl:`${host}/v1/coursesign/getCourseInfo`,
        couseSignUrl:`${host}/v1/coursesign/sign`,
        jobSignUrl:`${host}/v1/jobsign/sign`      
    }
}
export default config;