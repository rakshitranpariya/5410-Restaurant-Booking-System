import React from 'react'

function TopCustomer() {
  return (
    <div className='text-center py-5'>
      <h3>The top 10 customers who have ordered the most</h3>
      {/* <iframe width="950" height="950" src="https://lookerstudio.google.com/embed/reporting/2c575efc-5d7c-4bc4-9de5-c9aba8787643/page/lJajD" allowfullscreen></iframe> */}
      {/* <iframe width="950" height="950" src="https://lookerstudio.google.com/embed/reporting/ea789ae3-72d1-4748-a5a7-ab0bc1b4e80b/page/0oajD" allowfullscreen></iframe> */}
      <iframe style={{ height: "100vh", width: "84vw" }} src="https://lookerstudio.google.com/embed/reporting/10c54125-59b3-4ad2-a72d-ce170b5ef292/page/j6hjD" allowfullscreen></iframe>
      {/* <iframe width="600" height="450" src="https://lookerstudio.google.com/embed/reporting/10c54125-59b3-4ad2-a72d-ce170b5ef292/page/j6hjD" allowfullscreen></iframe> */}
    </div>
  )
}

export default TopCustomer