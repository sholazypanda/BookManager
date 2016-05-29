import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BookLoans {
	 static Connection conn = null;
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		BufferedReader br = new BufferedReader(new FileReader("/Users/shobhikapanda/Downloads/book_loans.csv"));
		String splitBy="\t";
		//Connection conn=null;
		String line;
		int i = 0;
		conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/library", "root", "niki");
		while ((line = br.readLine()) != null) {

			String[] b = line.split(splitBy);
			try {
				// Create a connection to the local MySQL server, with the "company"
				// database selected.
				// conn =
				// DriverManager.getConnection("jdbc:mysql://localhost:3306/company",
				// "root", "mypassword");
				// Create a connection to the local MySQL server, with the NO
				// database selected.
				
				PreparedStatement stmt = conn.prepareStatement("insert into book_loans (loan_id,isbn,branch_id,card_no,date_out,due_date,date_in) values(?,?,?,?,?,?,?)");
				stmt.setString(1, b[0]);
				stmt.setString(2, b[1]);
				stmt.setString(3, b[2]);
				stmt.setString(4, b[3]);
				stmt.setString(5, b[4]);
				stmt.setString(6, b[5]);
				stmt.setString(7, b[6]);
				stmt.executeUpdate();
				
				//System.out.println("Success!!");
			}
			catch(SQLException ex) {
				System.out.println("Error in connection: " + ex.getMessage());
			}
		}
		conn.close();
		System.out.println("Success!!");
		br.close();
	}

}
