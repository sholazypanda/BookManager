
/**
 *  NAME: DBTest.java
 *  AUTHOR: Chris Irwin Davis
 *          chrisirwindavis@utdallas.edu
 *          The Univeristy of Text at Dallas
 *  DATE: 8 JAN 2016
 *
 *  DESCRIPTION: This Java stub code is an example of how to connect to,
 *               query, and manipulate a MySQL database. This example is
 *               designed to work with the COMPANY database from the textbook
 *               "Fundamentals of Databse Design, 7/E" by Elmasri and Navathe.
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

public class CreateTables {
	static Connection conn = null;

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		String splitBy = "\t";
		HashMap<String, String> bookmap = new HashMap<>();
		HashMap<String, Integer> authormap = new HashMap<>();
		HashMap<String, String> bookauthor = new HashMap<>();
		List<String> prefixList = new ArrayList<>();
		prefixList.add("ms.");
		prefixList.add("miss.");
		prefixList.add("mrs.");
		prefixList.add("mr.");
		prefixList.add("master.");
		prefixList.add("rev.");
		prefixList.add("fr.");
		prefixList.add("dr.");
		prefixList.add("atty.");
		prefixList.add("prof.");
		prefixList.add("hon.");
		prefixList.add("pres.");
		prefixList.add("gov.");
		prefixList.add("coach.");
		prefixList.add("ofc.");
		List<String> suffixList = new ArrayList<>();
		suffixList.add("jr.");
		suffixList.add("sr.");

		BufferedReader br = new BufferedReader(new FileReader("/Users/shobhikapanda/Downloads/booksnew_1.csv"));
		String line = br.readLine();
		int i = 0;
		// ßThread.sleep(1000);
		 while ((line = br.readLine()) != null) {
			// System.out.println("hello"+line);
			String[] b = line.split(splitBy);
			// System.out.println(line);
			bookmap.put(b[0], b[2]);
			if (b[3].contains(",")) {
				String[] mulAuthors = b[3].split(",");
				for (int j = 0; j < mulAuthors.length; j++) {
					authormap.put(mulAuthors[j], ++i);
				}
			} else {
				authormap.put(b[3], ++i);
			}
			bookauthor.put(b[0], b[3]);
			// System.out.println(b[0]);
		}
		br.close();
		/*
		 * for(String key : authormap.keySet()) { if(key == null ||
		 * key.trim().length() ==0 ) { System.out.println("agggg");
		 * System.out.println("key is " + key + "value is " +
		 * authormap.get(key)); } System.out.println("key is " + key +
		 * "value is " + authormap.get(key)); }
		 */
		try {
			// Create a connection to the local MySQL server, with the "company"
			// database selected.
			// conn =
			// DriverManager.getConnection("jdbc:mysql://localhost:3306/company",
			// "root", "mypassword");
			// Create a connection to the local MySQL server, with the NO
			// database selected.
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/library", "root", "niki");

			// Create a SQL statement object and execute the query.

			// ResultSet rs;
			for (String str : bookmap.keySet()) {
				PreparedStatement stmt = conn.prepareStatement("insert into book (ISBN,TITLE) values(?,?)");
				// System.out.println(str.length());
				stmt.setString(1, str.trim());
				stmt.setString(2, bookmap.get(str));
				stmt.executeUpdate();
			}
			System.out.println("done 1st");
			for (String str : authormap.keySet()) {
				PreparedStatement stmt = conn.prepareStatement(
						"insert into authors (author_id,fullname,title,fname,mname,lname,suffix) values(?,?,?,?,?,?,?)");
				// System.out.println(str.length());
				String[] arrString = str.split(" ");
				stmt.setInt(1, authormap.get(str));
				stmt.setString(2, str);
				if (prefixList.contains(arrString[0].toLowerCase())) {
					stmt.setString(3, arrString[0]);
					stmt.setString(4, arrString[1]);
					if (arrString.length > 2) {
						stmt.setString(5, arrString[2]);
					} else {
						stmt.setString(5, null);
					}
					if (arrString.length > 3) {
						stmt.setString(6, arrString[3]);
					} else {
						stmt.setString(6, null);
					}
				} else {
					stmt.setString(3, null);
					stmt.setString(4, arrString[0]);
					if (arrString.length > 1) {
						stmt.setString(5, arrString[1]);
					} else {
						stmt.setString(5, null);
					}
					if (arrString.length > 2) {
						stmt.setString(6, arrString[2]);
					} else {
						stmt.setString(6, null);
					}
				}

				stmt.setString(7, null);
				stmt.executeUpdate();
			}
			System.out.println("done second");
			// rs.close();
			// ResultSet rs;
			HashSet<String> insertSet = new HashSet<>();
			for (String str : bookauthor.keySet()) {
				PreparedStatement stmt = conn.prepareStatement("insert into book_authors (ISBN,AUTHOR_ID) values(?,?)");
				// System.out.println(str.length());
				if (bookauthor.get(str).contains(",")) {
					String[] mulAuthors = bookauthor.get(str).split(",");
					for (int k = 0; k < mulAuthors.length; k++) {
						if (!insertSet.contains(mulAuthors[k])) {
							stmt.setString(1, str.trim());
							stmt.setInt(2, authormap.get(mulAuthors[k]));
							insertSet.add(mulAuthors[k]);
							stmt.executeUpdate();
						}
					}
				} else {
					// System.out.println(str);
					// System.out.println(authormap.get(bookauthor.get(str)));
					if (!insertSet.contains(bookauthor.get(str))) {
						stmt.setString(1, str.trim());
						stmt.setInt(2, authormap.get(bookauthor.get(str)));
						insertSet.add(bookauthor.get(str));
						stmt.executeUpdate();
					}
				}
				// stmt.setString(1, str.substring(1));

			}
			conn.close();
			System.out.println("Success!!");
		} catch (SQLException ex) {
			System.out.println("Error in connection: " + ex.getMessage());
		}

	}

}