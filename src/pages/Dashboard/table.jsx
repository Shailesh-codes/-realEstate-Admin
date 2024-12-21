<div className="Members overflow-x-auto mt-16">
<table>
  <thead>
    <tr>
      {!isTrainer && <th>Trainer</th>}
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>DOB</th>
      <th>Gender</th>
      <th>Address</th>
      <th>{isTrainer ? 'Specialization' : 'Membership Type'}</th>
      <th>{isTrainer ? 'Joining Date' : 'Start Date'}</th>
      <th>{isTrainer ? 'Experience' : 'End Date'}</th>
      <th>{isTrainer ? 'Certification' : 'Fitness Goal'}</th>
      <th>{isTrainer ? 'Available Hours' :'Payment Status'}</th>
      <th>{isTrainer ? 'Rating' : 'Paid'}</th>
      <th>{isTrainer ? 'Total Clients' : 'Balance'}</th>
      <th>{isTrainer ? 'Salary' : 'Total'}</th>
      {!isTrainer && <th>Admitted By</th>}
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {(AllFormData.slice(selectedPage * itemPerPage - itemPerPage, selectedPage * itemPerPage)).map((member, index) => (
      <tr key={index}>
       {!isTrainer && <td>{member.trainer}</td>}
        <td>{member.name}</td>
        <td>{member.email}</td>
        <td>{member.phone}</td>
        <td>{member.dob}</td>
        <td>{member.gender}</td>
        <td>{member.address}</td>
        <td>{isTrainer ? member.specialization : member.membershipType}</td>
        <td>{isTrainer ? member.joiningDate : member.startDate}</td>
        {!isTrainer && <td>{member.endDate}</td>}
        <td>{isTrainer ? member.experience : member.fitnessGoal}</td>
        <td>{isTrainer ? member.certification : member.paymentStatus}</td>
        <td>{isTrainer ? member.availableHours : member.paid}</td>
        <td>{isTrainer ? member.rating : member.balance}</td>
        {!isTrainer && <td>{member.total}</td>}
        <td>{isTrainer ? member.totalClients : member.admittedBy}</td>
        {isTrainer && <td>{member.salary}</td>}
        <td onClick={handleNavigate}>View</td>
      </tr>
    ))}
  </tbody>
</table>
</div>